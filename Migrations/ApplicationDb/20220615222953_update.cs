using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseCategories_SlugMap_CourseCategories_SlugMapId",
                table: "CourseCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_SlugMap_Courses_SlugMapId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_SlugMap_Lessons_SlugMapId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Sections_SlugMap_Sections_SlugMapId",
                table: "Sections");

            migrationBuilder.DropForeignKey(
                name: "FK_SlugMap_Categories_Categories_CategoryId",
                table: "SlugMap_Categories");

            migrationBuilder.DropIndex(
                name: "IX_SlugMap_Categories_CategoryId",
                table: "SlugMap_Categories");

            migrationBuilder.DropIndex(
                name: "IX_Sections_SlugMapId",
                table: "Sections");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_SlugMapId",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Courses_SlugMapId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_CourseCategories_SlugMapId",
                table: "CourseCategories");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "SlugMap_Categories");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "CourseCategories");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(5227),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(1731));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(4750),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(778));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6950),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(4688));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6339),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(3667));

            migrationBuilder.AddColumn<int>(
                name: "SlugMapId",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_SlugMapId",
                table: "Categories",
                column: "SlugMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_SlugMap_Categories_SlugMapId",
                table: "Categories",
                column: "SlugMapId",
                principalTable: "SlugMap_Categories",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_SlugMap_Categories_SlugMapId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_SlugMapId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Categories");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "SlugMap_Categories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SlugMapId",
                table: "Sections",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(1731),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(5227));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(778),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(4750));

            migrationBuilder.AddColumn<int>(
                name: "SlugMapId",
                table: "Lessons",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(4688),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6950));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(3667),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6339));

            migrationBuilder.AddColumn<int>(
                name: "SlugMapId",
                table: "Courses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SlugMapId",
                table: "CourseCategories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Categories_CategoryId",
                table: "SlugMap_Categories",
                column: "CategoryId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sections_SlugMapId",
                table: "Sections",
                column: "SlugMapId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SlugMapId",
                table: "Lessons",
                column: "SlugMapId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_SlugMapId",
                table: "Courses",
                column: "SlugMapId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseCategories_SlugMapId",
                table: "CourseCategories",
                column: "SlugMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseCategories_SlugMap_CourseCategories_SlugMapId",
                table: "CourseCategories",
                column: "SlugMapId",
                principalTable: "SlugMap_CourseCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_SlugMap_Courses_SlugMapId",
                table: "Courses",
                column: "SlugMapId",
                principalTable: "SlugMap_Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_SlugMap_Lessons_SlugMapId",
                table: "Lessons",
                column: "SlugMapId",
                principalTable: "SlugMap_Lessons",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sections_SlugMap_Sections_SlugMapId",
                table: "Sections",
                column: "SlugMapId",
                principalTable: "SlugMap_Sections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SlugMap_Categories_Categories_CategoryId",
                table: "SlugMap_Categories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
