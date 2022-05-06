using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class AddMenus4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PostCount",
                table: "MenuItems");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(4775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(9172));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(3973),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(8727));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(9172),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(4775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(8727),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(3973));

            migrationBuilder.AddColumn<int>(
                name: "PostCount",
                table: "MenuItems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
