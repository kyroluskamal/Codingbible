using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class descriptionLength2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_parentKey",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "parentKey",
                table: "Categories",
                newName: "ParentKey");

            migrationBuilder.RenameIndex(
                name: "IX_Categories_parentKey",
                table: "Categories",
                newName: "IX_Categories_ParentKey");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentKey",
                table: "Categories",
                column: "ParentKey",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentKey",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "ParentKey",
                table: "Categories",
                newName: "parentKey");

            migrationBuilder.RenameIndex(
                name: "IX_Categories_ParentKey",
                table: "Categories",
                newName: "IX_Categories_parentKey");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_parentKey",
                table: "Categories",
                column: "parentKey",
                principalTable: "Categories",
                principalColumn: "Id");
        }
    }
}
