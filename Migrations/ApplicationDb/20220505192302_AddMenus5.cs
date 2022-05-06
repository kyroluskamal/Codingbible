using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class AddMenus5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Menus_MenuPositions_MenuPositionsId",
                table: "Menus");

            migrationBuilder.DropTable(
                name: "MenuPositions");

            migrationBuilder.RenameColumn(
                name: "MenuPositionsId",
                table: "Menus",
                newName: "MenuLocationsId");

            migrationBuilder.RenameIndex(
                name: "IX_Menus_MenuPositionsId",
                table: "Menus",
                newName: "IX_Menus_MenuLocationsId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 21, 23, 2, 27, DateTimeKind.Local).AddTicks(6193),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(4775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 21, 23, 2, 27, DateTimeKind.Local).AddTicks(5596),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(3973));

            migrationBuilder.CreateTable(
                name: "MenuLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuLocations", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Menus_MenuLocations_MenuLocationsId",
                table: "Menus",
                column: "MenuLocationsId",
                principalTable: "MenuLocations",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Menus_MenuLocations_MenuLocationsId",
                table: "Menus");

            migrationBuilder.DropTable(
                name: "MenuLocations");

            migrationBuilder.RenameColumn(
                name: "MenuLocationsId",
                table: "Menus",
                newName: "MenuPositionsId");

            migrationBuilder.RenameIndex(
                name: "IX_Menus_MenuLocationsId",
                table: "Menus",
                newName: "IX_Menus_MenuPositionsId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(4775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 21, 23, 2, 27, DateTimeKind.Local).AddTicks(6193));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 20, 58, 3, 324, DateTimeKind.Local).AddTicks(3973),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 21, 23, 2, 27, DateTimeKind.Local).AddTicks(5596));

            migrationBuilder.CreateTable(
                name: "MenuPositions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuPositions", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Menus_MenuPositions_MenuPositionsId",
                table: "Menus",
                column: "MenuPositionsId",
                principalTable: "MenuPositions",
                principalColumn: "Id");
        }
    }
}
