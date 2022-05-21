using Microsoft.AspNetCore.Mvc;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.ConstantsService;
using System.Drawing;
using CodingBible.UnitOfWork;
using CodingBible.Models;
using Microsoft.AspNetCore.Authorization;
using CodingBible.Models.Posts;
using Microsoft.AspNetCore.Cors;

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
            var relativePath = $"Uploads/{DateTime.Now.Year}/{DateTime.Now.Month}";
            var filePath = Path.Combine(Env.WebRootPath, relativePath);
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            var FileData = new List<Attachments>();
            foreach (var file in files)
            {
                using (var stream = new FileStream(Path.Combine(filePath, file.FileName), FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                    await stream.FlushAsync();
                    stream.Close();
                }
                var Image_Compressed_Path = "";
                var Image_Resized_Path = "";
                var Image_Thumbnail_path = "";
                var extension = "";
                var imgWidth = 0;
                var imgHeight = 0;
                if (Constants.imageExtensions.Contains(file.FileName.Split(".")[1]))
                {
                    extension = file.FileName.Split('.')[1];
                    var newPath_WithoutExtension = Path.Combine(Env.WebRootPath, relativePath + "/" + file.FileName.Split('.')[0]);
                    var img = Image.FromFile(newPath_WithoutExtension + "." + extension);
                    imgWidth = img.Width;
                    imgHeight = img.Height;

                    if (imgWidth > 600)
                    {
                        Image_Compressed_Path = relativePath + "/" + file.FileName.Split('.')[0] + "600_Compressed." + extension;
                        Image_Resized_Path = relativePath + "/" + file.FileName.Split('.')[0] + "600." + extension;
                        Image_Thumbnail_path = relativePath + "/" + file.FileName.Split('.')[0] + "600_Compressed_Thumbnail." + extension;
                        await FunctionalService.ResizeImage_SCALE(newPath_WithoutExtension + "." + extension, newPath_WithoutExtension + "600." + extension, 600, "scale");
                        await FunctionalService.CompressImage(newPath_WithoutExtension + "600." + extension, newPath_WithoutExtension + "600_Compressed." + extension);
                        await FunctionalService.ResizeImage_OtherMedthods(newPath_WithoutExtension + "600_Compressed." + extension, newPath_WithoutExtension + "600_Compressed_Thumbnail." + extension, 100, 100, "fit");
                    }
                    else
                    {
                        Image_Compressed_Path = relativePath + "/" + file.FileName.Split('.')[0] + "_Compressed." + extension;
                        Image_Thumbnail_path = relativePath + "/" + file.FileName.Split('.')[0] + "_Compressed_Thumbnail." + extension;
                        await FunctionalService.CompressImage(newPath_WithoutExtension + "." + extension, newPath_WithoutExtension + "_Compressed." + extension);
                        await FunctionalService.ResizeImage_OtherMedthods(newPath_WithoutExtension + "_Compressed." + extension, newPath_WithoutExtension + "_Compressed_Thumbnail." + extension, 100, 100, "fit");
                    }
                    img.Dispose();
                }
                FileData.Add(new Attachments
                {
                    FileName = file.FileName,
                    FileUrl = "/" + Image_Compressed_Path,
                    ThumbnailUrl = "/" + Image_Thumbnail_path,
                    FileType = file.ContentType,
                    FileExtension = extension,
                    FileSize = file.Length,
                    CreatedDate = DateTime.Now,
                    Width = imgWidth.ToString(),
                    Height = imgHeight.ToString()
                });
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
        catch (System.Exception ex)
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
}
