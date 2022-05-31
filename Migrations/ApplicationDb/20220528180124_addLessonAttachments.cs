using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class addLessonAttachments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8908),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(3233));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8300),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(2797));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Lessons",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LasModified",
                table: "Lessons",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedDate",
                table: "Lessons",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(707),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(5258));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(54),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(4243));

            migrationBuilder.CreateTable(
                name: "LessonAttachments",
                columns: table => new
                {
                    LessonId = table.Column<int>(type: "int", nullable: false),
                    AttachmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonAttachments", x => new { x.LessonId, x.AttachmentId });
                    table.ForeignKey(
                        name: "FK_LessonAttachments_Attachments_AttachmentId",
                        column: x => x.AttachmentId,
                        principalTable: "Attachments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LessonAttachments_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LessonAttachments_AttachmentId",
                table: "LessonAttachments",
                column: "AttachmentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LessonAttachments");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "LasModified",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "PublishedDate",
                table: "Lessons");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(3233),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8908));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(2797),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8300));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(5258),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(707));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 17, 5, 15, 775, DateTimeKind.Local).AddTicks(4243),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(54));
        }
    }
}
