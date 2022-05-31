using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class addFeatureImageUrlToLesson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(8411),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8908));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(7790),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8300));

            migrationBuilder.AddColumn<string>(
                name: "FeatureImageUrl",
                table: "Lessons",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 38, 0, DateTimeKind.Local).AddTicks(334),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(707));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(9597),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(54));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeatureImageUrl",
                table: "Lessons");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8908),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(8411));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 589, DateTimeKind.Local).AddTicks(8300),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(7790));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(707),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 38, 0, DateTimeKind.Local).AddTicks(334));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 28, 20, 1, 24, 590, DateTimeKind.Local).AddTicks(54),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 28, 20, 16, 37, 999, DateTimeKind.Local).AddTicks(9597));
        }
    }
}
