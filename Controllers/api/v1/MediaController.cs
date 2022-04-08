using Microsoft.AspNetCore.Mvc;
using CodingBible.Models.Posts;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.ConstantsService;
using System.Drawing;
using CodingBible.UnitOfWork;
using CodingBible.Models;

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
                }
                var Image_Compressed_Path = "";
                var Image_Resized_Path = "";
                var extension = "";
                if (Constants.imageExtensions.Contains(file.FileName.Split(".")[1]))
                {
                    extension = file.FileName.Split('.')[1];
                    var newPath_WithoutExtension = Path.Combine(Env.WebRootPath, relativePath + "/" + file.FileName.Split('.')[0]);
                    var img = Image.FromFile(newPath_WithoutExtension + "." + extension);
                    var imgWidth = img.Width;
                    var imgHeight = img.Height;

                    if (imgWidth > 600)
                    {
                        Image_Compressed_Path = relativePath + "/" + file.FileName.Split('.')[0] + "600_Compressed." + extension;
                        Image_Resized_Path = relativePath + "/" + file.FileName.Split('.')[0] + "600." + extension;
                        await FunctionalService.ResizeImage(newPath_WithoutExtension + "." + extension, newPath_WithoutExtension + "600." + extension, 600, "scale");
                        await FunctionalService.CompressImage(newPath_WithoutExtension + "600." + extension, newPath_WithoutExtension + "600_Compressed." + extension);
                    }
                    else
                    {
                        Image_Compressed_Path = relativePath + "/" + file.FileName.Split('.')[0] + "_Compressed." + extension;
                        await FunctionalService.CompressImage(newPath_WithoutExtension + "." + extension, newPath_WithoutExtension + "_Compressed." + extension);
                    }

                    // FileInfo OriginalFile = new(newPath_WithoutExtension + "." + extension);
                    // if (OriginalFile.Exists)
                    // {
                    //     OriginalFile.Delete();
                    // }
                    // else
                    // {
                    //     return BadRequest("Cant delete");
                    // }
                }
                FileData.Add(new Attachments
                {
                    FileName = file.FileName,
                    FileUrl = "/" + Image_Compressed_Path,
                    FileType = file.ContentType,
                    FileExtension = extension,
                    FileSize = file.Length,
                    CreatedDate = DateTime.Now,
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
}
