using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class UpdaNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostsCategory_Categories_CategoryId",
                table: "PostsCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_PostsCategory_Posts_PostId",
                table: "PostsCategory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostsCategory",
                table: "PostsCategory");

            migrationBuilder.RenameTable(
                name: "PostsCategory",
                newName: "PostsCategories");

            migrationBuilder.RenameIndex(
                name: "IX_PostsCategory_CategoryId",
                table: "PostsCategories",
                newName: "IX_PostsCategories_CategoryId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(5509),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 14, 0, 10, 31, 351, DateTimeKind.Local).AddTicks(1596));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(4488),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 14, 0, 10, 31, 351, DateTimeKind.Local).AddTicks(1025));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostsCategories",
                table: "PostsCategories",
                columns: new[] { "PostId", "CategoryId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PostsCategories_Categories_CategoryId",
                table: "PostsCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostsCategories_Posts_PostId",
                table: "PostsCategories",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostsCategories_Categories_CategoryId",
                table: "PostsCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_PostsCategories_Posts_PostId",
                table: "PostsCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostsCategories",
                table: "PostsCategories");

            migrationBuilder.RenameTable(
                name: "PostsCategories",
                newName: "PostsCategory");

            migrationBuilder.RenameIndex(
                name: "IX_PostsCategories_CategoryId",
                table: "PostsCategory",
                newName: "IX_PostsCategory_CategoryId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 14, 0, 10, 31, 351, DateTimeKind.Local).AddTicks(1596),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(5509));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 14, 0, 10, 31, 351, DateTimeKind.Local).AddTicks(1025),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(4488));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostsCategory",
                table: "PostsCategory",
                columns: new[] { "PostId", "CategoryId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PostsCategory_Categories_CategoryId",
                table: "PostsCategory",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostsCategory_Posts_PostId",
                table: "PostsCategory",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
