using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class AddMenus3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "Menus");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(9172),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 10, 28, 658, DateTimeKind.Local).AddTicks(4772));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(8727),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 10, 28, 658, DateTimeKind.Local).AddTicks(4005));

            migrationBuilder.AddColumn<int>(
                name: "MenuPositionsId",
                table: "Menus",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Menus_MenuPositionsId",
                table: "Menus",
                column: "MenuPositionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Menus_MenuPositions_MenuPositionsId",
                table: "Menus",
                column: "MenuPositionsId",
                principalTable: "MenuPositions",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Menus_MenuPositions_MenuPositionsId",
                table: "Menus");

            migrationBuilder.DropIndex(
                name: "IX_Menus_MenuPositionsId",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "MenuPositionsId",
                table: "Menus");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 10, 28, 658, DateTimeKind.Local).AddTicks(4772),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(9172));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 10, 28, 658, DateTimeKind.Local).AddTicks(4005),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 22, 46, 763, DateTimeKind.Local).AddTicks(8727));

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Menus",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
