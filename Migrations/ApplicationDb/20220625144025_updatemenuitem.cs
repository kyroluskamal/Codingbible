using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class updatemenuitem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(5038),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(5227));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(4311),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(4750));

            migrationBuilder.AddColumn<int>(
                name: "OrderWithMenu",
                table: "MenuItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(7579),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6950));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(6601),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6339));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderWithMenu",
                table: "MenuItems");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(5227),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(5038));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(4750),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(4311));

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6950),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(7579));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Courses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 6, 16, 0, 29, 52, 930, DateTimeKind.Local).AddTicks(6339),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 6, 25, 16, 40, 24, 819, DateTimeKind.Local).AddTicks(6601));
        }
    }
}
