using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class addslugmap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsArabic",
                table: "Sections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(5586),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(8411));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(4788),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(7790));

            migrationBuilder.AddColumn<bool>(
                name: "IsArabic",
                table: "Posts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsArabic",
                table: "Lessons",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(8127),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 38, 0, DateTimeKind.Local).AddTicks(334));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(7385),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(9597));

            migrationBuilder.AddColumn<bool>(
                name: "IsArabic",
                table: "Courses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsArabic",
                table: "CourseCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsArabic",
                table: "Categories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "SlugMap_Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlugMap_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlugMap_Categories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SlugMap_CourseCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CourseCategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlugMap_CourseCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlugMap_CourseCategories_CourseCategories_CourseCategoryId",
                        column: x => x.CourseCategoryId,
                        principalTable: "CourseCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SlugMap_Courses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlugMap_Courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlugMap_Courses_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SlugMap_Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlugMap_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlugMap_Lessons_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SlugMap_Posts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlugMap_Posts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlugMap_Posts_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SlugMap_Sections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArSlug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlugMap_Sections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlugMap_Sections_Sections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "Sections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Categories_CategoryId",
                table: "SlugMap_Categories",
                column: "CategoryId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_CourseCategories_CourseCategoryId",
                table: "SlugMap_CourseCategories",
                column: "CourseCategoryId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Courses_CourseId",
                table: "SlugMap_Courses",
                column: "CourseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Lessons_LessonId",
                table: "SlugMap_Lessons",
                column: "LessonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Posts_PostId",
                table: "SlugMap_Posts",
                column: "PostId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlugMap_Sections_SectionId",
                table: "SlugMap_Sections",
                column: "SectionId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SlugMap_Categories");

            migrationBuilder.DropTable(
                name: "SlugMap_CourseCategories");

            migrationBuilder.DropTable(
                name: "SlugMap_Courses");

            migrationBuilder.DropTable(
                name: "SlugMap_Lessons");

            migrationBuilder.DropTable(
                name: "SlugMap_Posts");

            migrationBuilder.DropTable(
                name: "SlugMap_Sections");

            migrationBuilder.DropColumn(
                name: "IsArabic",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "IsArabic",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsArabic",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "IsArabic",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "IsArabic",
                table: "CourseCategories");

            migrationBuilder.DropColumn(
                name: "IsArabic",
                table: "Categories");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(8411),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(5586));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(7790),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(4788));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 38, 0, DateTimeKind.Local).AddTicks(334),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(8127));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(9597),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 10, 22, 32, 47, 879, DateTimeKind.Local).AddTicks(7385));
        }
    }
}
