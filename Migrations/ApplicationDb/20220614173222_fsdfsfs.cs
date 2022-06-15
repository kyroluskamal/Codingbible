using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class fsdfsfs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SlugMap_CourseCategories_CourseCategories_CourseCategoryId",
                table: "SlugMap_CourseCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_SlugMap_Courses_Courses_CourseId",
                table: "SlugMap_Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_SlugMap_Lessons_Lessons_LessonId",
                table: "SlugMap_Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_SlugMap_Posts_Posts_PostId",
                table: "SlugMap_Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_SlugMap_Sections_Sections_SectionId",
                table: "SlugMap_Sections");

            migrationBuilder.DropIndex(
                name: "IX_SlugMap_Sections_SectionId",
                table: "SlugMap_Sections");

            migrationBuilder.DropIndex(
                name: "IX_SlugMap_Posts_PostId",
                table: "SlugMap_Posts");

            migrationBuilder.DropIndex(
                name: "IX_SlugMap_Lessons_LessonId",
                table: "SlugMap_Lessons");

            migrationBuilder.DropIndex(
                name: "IX_SlugMap_Courses_CourseId",
                table: "SlugMap_Courses");

            migrationBuilder.DropIndex(
                name: "IX_SlugMap_CourseCategories_CourseCategoryId",
                table: "SlugMap_CourseCategories");

            migrationBuilder.DropColumn(
                name: "SectionId",
                table: "SlugMap_Sections");

            migrationBuilder.DropColumn(
                name: "PostId",
                table: "SlugMap_Posts");

            migrationBuilder.DropColumn(
                name: "LessonId",
                table: "SlugMap_Lessons");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "SlugMap_Courses");

            migrationBuilder.DropColumn(
                name: "CourseCategoryId",
                table: "SlugMap_CourseCategories");

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
                oldDefaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(1127));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(778),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(485));

            migrationBuilder.AddColumn<int>(
                name: "SlugMapId",
                table: "Posts",
                type: "int",
                nullable: true);

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
                oldDefaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(3440));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(3667),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(2522));

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
                name: "IX_Sections_SlugMapId",
                table: "Sections",
                column: "SlugMapId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_SlugMapId",
                table: "Posts",
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
                name: "FK_Posts_SlugMap_Posts_SlugMapId",
                table: "Posts",
                column: "SlugMapId",
                principalTable: "SlugMap_Posts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sections_SlugMap_Sections_SlugMapId",
                table: "Sections",
                column: "SlugMapId",
                principalTable: "SlugMap_Sections",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "FK_Posts_SlugMap_Posts_SlugMapId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Sections_SlugMap_Sections_SlugMapId",
                table: "Sections");

            migrationBuilder.DropIndex(
                name: "IX_Sections_SlugMapId",
                table: "Sections");

            migrationBuilder.DropIndex(
                name: "IX_Posts_SlugMapId",
                table: "Posts");

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
                name: "SlugMapId",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "SlugMapId",
                table: "CourseCategories");

            migrationBuilder.AddColumn<int>(
                name: "SectionId",
                table: "SlugMap_Sections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PostId",
                table: "SlugMap_Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LessonId",
                table: "SlugMap_Lessons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "SlugMap_Courses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CourseCategoryId",
                table: "SlugMap_CourseCategories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(1127),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(1731));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(485),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(778));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(3440),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(4688));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 12, 20, 51, 50, 48, DateTimeKind.Local).AddTicks(2522),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 14, 19, 32, 22, 108, DateTimeKind.Local).AddTicks(3667));

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Sections_SectionId",
                table: "SlugMap_Sections",
                column: "SectionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Posts_PostId",
                table: "SlugMap_Posts",
                column: "PostId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Lessons_LessonId",
                table: "SlugMap_Lessons",
                column: "LessonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Courses_CourseId",
                table: "SlugMap_Courses",
                column: "CourseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_CourseCategories_CourseCategoryId",
                table: "SlugMap_CourseCategories",
                column: "CourseCategoryId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SlugMap_CourseCategories_CourseCategories_CourseCategoryId",
                table: "SlugMap_CourseCategories",
                column: "CourseCategoryId",
                principalTable: "CourseCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SlugMap_Courses_Courses_CourseId",
                table: "SlugMap_Courses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SlugMap_Lessons_Lessons_LessonId",
                table: "SlugMap_Lessons",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SlugMap_Posts_Posts_PostId",
                table: "SlugMap_Posts",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SlugMap_Sections_Sections_SectionId",
                table: "SlugMap_Sections",
                column: "SectionId",
                principalTable: "Sections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
