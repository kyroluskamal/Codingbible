using Microsoft.AspNetCore.Mvc;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.ConstantsService;
//using System.Drawing;
using CodingBible.UnitOfWork;
using CodingBible.Models;
using Microsoft.AspNetCore.Authorization;
using CodingBible.Models.Posts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
//using ImageProcessor;
//using ImageProcessor.Plugins.WebP.Imaging.Formats;
using Microsoft.AspNetCore.StaticFiles;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace CodingBible.Controllers.api.v1;
[ApiVersion("1.0")]
[ApiController]
[Route("api/v1/[controller]")]
public class MediaController : ControllerBase
{
    private IWebHostEnvironment Env { get; }
    private IUnitOfWork_ApplicationUser UnitOfWork { get; }
    private IFunctionalService FunctionalService { get; }

    public MediaController(IWebHostEnvironment env, IFunctionalService functionalService, IUnitOfWork_ApplicationUser unitOfWork)
    {
        Env = env;
        FunctionalService = functionalService;
        UnitOfWork = unitOfWork;
    }

    [HttpPost(nameof(Upload)), DisableRequestSizeLimit]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> Upload()
    {
        try
        {
            IFormFileCollection files = Request.Form.Files;
            if (files.Count == 0)
            {
                return BadRequest("No files received from the upload");
            }
            var FolderPath = $"Uploads/{DateTime.Now.Year}/{DateTime.Now.Month}";
            var filePath = Path.Combine(Env.WebRootPath, FolderPath);
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            var FileData = new List<Attachments>();
            var sm_size = new Size(300, 0);
            var thumb_Size = new Size(150, 0);

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName);

                if (Constants.imageExtensions.Contains(extension))
                {
                    var Xl_Size = new Size();
                    var md_lg_size = new Size();

                    var rootWithFolderPath_withoutExtension = Path.Combine(filePath, Path.GetFileNameWithoutExtension(file.FileName));

                    var relativePath_without_extension = Path.Combine(FolderPath, Path.GetFileNameWithoutExtension(file.FileName));
                    var originalPath_full = rootWithFolderPath_withoutExtension + extension;

                    var WebpResized_xl = rootWithFolderPath_withoutExtension + "_xl.webp";
                    var WebpResized_md_lg = rootWithFolderPath_withoutExtension + "_md.webp";
                    var WebpResized_sm = rootWithFolderPath_withoutExtension + "_sm.webp";

                    var WebPCompressed_md_lg = rootWithFolderPath_withoutExtension + "_md_c.webp";
                    var WebPCompressed_xl = rootWithFolderPath_withoutExtension + "_xl_c.webp";
                    var WebPCompressed_sm = rootWithFolderPath_withoutExtension + "_sm_c.webp";

                    var WepbThumbnail = rootWithFolderPath_withoutExtension + "_th.jpg";
                    var WepbThumbnail_c = rootWithFolderPath_withoutExtension + "_th_c.jpg";
                    using var img = Image.Load(file.OpenReadStream());

                    Xl_Size.Width = img.Width;
                    Xl_Size.Height = img.Height;
                    if (img.Width > 600)
                    {
                        md_lg_size.Width = 600;
                        md_lg_size.Height = 0;
                    }
                    else
                    {
                        md_lg_size.Width = img.Width;
                        md_lg_size.Height = img.Height;
                    }
                    //create image for xl screens 
                    CreateImage(img, WebpResized_xl, Xl_Size);
                    //create image for md lg screens
                    CreateImage(img, WebpResized_md_lg, md_lg_size);
                    //creaet image for sm screens
                    CreateImage(img, WebpResized_sm, sm_size);
                    //create thumbail
                    CreateImage(img, WepbThumbnail, thumb_Size);

                    //Compress images
                    await FunctionalService.CompressImage(WebpResized_xl, WebPCompressed_xl);
                    await FunctionalService.CompressImage(WebpResized_md_lg, WebPCompressed_md_lg);
                    await FunctionalService.CompressImage(WebpResized_sm, WebPCompressed_sm);
                    await FunctionalService.CompressImage(WepbThumbnail, WepbThumbnail_c);
                    //delete unneeded images
                    System.IO.File.Delete(originalPath_full);
                    System.IO.File.Delete(WebpResized_xl);
                    System.IO.File.Delete(WebpResized_md_lg);
                    System.IO.File.Delete(WebpResized_sm);
                    System.IO.File.Delete(WepbThumbnail);

                    System.IO.File.Move(WebPCompressed_xl, WebPCompressed_xl.Replace("_c", ""));
                    System.IO.File.Move(WebPCompressed_md_lg, WebPCompressed_md_lg.Replace("_c", ""));
                    System.IO.File.Move(WebPCompressed_sm, WebPCompressed_sm.Replace("_c", ""));
                    System.IO.File.Move(WepbThumbnail_c, WepbThumbnail_c.Replace("_c", ""));

                    WebPCompressed_xl = WebPCompressed_xl.Replace("_c", "");
                    WebPCompressed_md_lg = WebPCompressed_md_lg.Replace("_c", "");
                    WebPCompressed_sm = WebPCompressed_sm.Replace("_c", "");
                    WepbThumbnail_c = WepbThumbnail_c.Replace("_c", "");

                    var finalFile = new FileInfo(WebPCompressed_xl);
                    new FileExtensionContentTypeProvider().TryGetContentType(finalFile.Name, out string contentType);
                    FileData.Add(new Attachments
                    {
                        FileName = finalFile.Name.Replace("_xl", ""),
                        FileUrl_xl = "/" + Path.GetRelativePath(Env.WebRootPath, WebPCompressed_xl).Replace('\\', '/'),
                        FileUrl_md_lg = "/" + Path.GetRelativePath(Env.WebRootPath, WebPCompressed_md_lg).Replace('\\', '/'),
                        FileUrl_sm = "/" + Path.GetRelativePath(Env.WebRootPath, WebPCompressed_sm).Replace('\\', '/'),
                        ThumbnailUrl = "/" + Path.GetRelativePath(Env.WebRootPath, WepbThumbnail_c).Replace('\\', '/'),
                        FileType = contentType,
                        FileExtension = Path.GetExtension(finalFile.Name),
                        FileSize = finalFile.Length,
                        CreatedDate = DateTime.Now,
                        Width = Xl_Size.Width.ToString(),
                        Height = Xl_Size.Height.ToString()
                    });
                }
            }
            await UnitOfWork.Attachments.AddRangeAsync(FileData.ToArray());
            await UnitOfWork.SaveAsync();
            return Ok(FileData.ToList());
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet(nameof(GetAll))]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var data = await UnitOfWork.Attachments.GetAllAsync(orderBy: q => q.OrderByDescending(d => d.CreatedDate));
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpDelete(nameof(Delete) + "/{id}")]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            var data = await UnitOfWork.Attachments.GetAsync(id);
            if (data == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("File"));
            }
            var relativePath = $"Uploads/{data.CreatedDate.Year}/{data.CreatedDate.Month}";
            var originalFilePath = Path.Combine(Env.WebRootPath, relativePath + "/" + data.FileName);
            var compressedFilePath = Path.Combine(Env.WebRootPath, relativePath + "/" + data.FileName.Split('.')[0] + "_Compressed." + data.FileExtension);
            var thumbnailFilePath = Path.Combine(Env.WebRootPath, relativePath + "/" + data.FileName.Split('.')[0] + "_Compressed_Thumbnail." + data.FileExtension);
            if (System.IO.File.Exists(originalFilePath))
            {
                System.IO.File.Delete(originalFilePath);
            }
            if (System.IO.File.Exists(compressedFilePath))
            {
                System.IO.File.Delete(compressedFilePath);
            }
            if (System.IO.File.Exists(thumbnailFilePath))
            {
                System.IO.File.Delete(thumbnailFilePath);
            }

            await UnitOfWork.Attachments.RemoveAsync(id);
            await UnitOfWork.SaveAsync();
            return Ok(Constants.HttpResponses.Delete_Sucess("Image"));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPut(nameof(Update))]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> Update([FromBody] Attachments model)
    {
        try
        {
            var data = await UnitOfWork.Attachments.GetAsync(model.Id);
            if (data == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(model.FileName));
            }
            data.Title = model.Title;
            data.Description = model.Description;
            data.Caption = model.Caption;
            data.AltText = model.AltText;
            await UnitOfWork.SaveAsync();
            return Ok(Constants.HttpResponses.Update_Sucess("Image"));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpDelete("DeleteFromPost/{postId}/{AttachId}")]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> DeleteFromPost([FromRoute] int postId, [FromRoute] int AttachId)
    {
        try
        {
            var data = await UnitOfWork.PostAttachments.GetFirstOrDefaultAsync(x => x.PostId == postId && x.AttachmentId == AttachId);
            UnitOfWork.PostAttachments.Remove(data);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Delete_Sucess("Image"));
            }
            return BadRequest(Constants.HttpResponses.Delete_Failed("Image"));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("BindAttachmentToPost/{postId}/{AttachId}")]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> BindAttachmentToPost([FromRoute] int postId, [FromRoute] int AttachId)
    {
        try
        {
            var attachment = await UnitOfWork.PostAttachments.GetFirstOrDefaultAsync(x => x.PostId == postId && x.AttachmentId == AttachId);
            if (attachment == null)
            {
                var NewPostAttachment = new PostAttachments()
                {
                    PostId = postId,
                    AttachmentId = AttachId
                };
                await UnitOfWork.PostAttachments.AddAsync(NewPostAttachment);
                var addResult = await UnitOfWork.SaveAsync();
                if (addResult > 0)
                {
                    return Ok(NewPostAttachment);
                }
                return BadRequest(Constants.HttpResponses.Addition_Failed("Attachment"));
            }
            else
            {
                attachment.PostId = postId;
                attachment.AttachmentId = AttachId;
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Delete_Sucess("Image"));
                }
                return BadRequest(Constants.HttpResponses.Delete_Failed("Image"));
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private static void CreateImage(Image img, string destinationLink, Size size, bool thumbail = false)
    {
        using var webPFileStream = new FileStream(destinationLink, FileMode.Create);

        img.Mutate(x => x
            .Resize(new ResizeOptions()
            {
                Size = size,
                Mode = ResizeMode.Stretch,
            })
        );
        if (!thumbail)
        {
            img.SaveAsWebp(webPFileStream, new WebpEncoder()
            {
                FileFormat = WebpFileFormatType.Lossless,
                Method = WebpEncodingMethod.Default,
            });
        }
        else
        {
            img.SaveAsJpeg(webPFileStream, new JpegEncoder()
            {
                Quality = 100,
            });
        }
        webPFileStream.Close();
    }
}