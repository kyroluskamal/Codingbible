using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class AddMenus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Menus_Menus_ParentKey",
                table: "Menus");

            migrationBuilder.DropIndex(
                name: "IX_Menus_ParentKey",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "OrderWithinParent",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "ParentKey",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "PostCount",
                table: "Menus");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Menus",
                newName: "Position");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 19, 31, 57, 814, DateTimeKind.Local).AddTicks(5160),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 16, 57, 17, 351, DateTimeKind.Local).AddTicks(9143));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 19, 31, 57, 814, DateTimeKind.Local).AddTicks(4719),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 16, 57, 17, 351, DateTimeKind.Local).AddTicks(8336));

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Level = table.Column<byte>(type: "tinyint", nullable: false),
                    OrderWithinParent = table.Column<int>(type: "int", nullable: false),
                    PostCount = table.Column<int>(type: "int", nullable: false),
                    ParentKey = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItems_MenuItems_ParentKey",
                        column: x => x.ParentKey,
                        principalTable: "MenuItems",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MenuMenuItems",
                columns: table => new
                {
                    MenuItemId = table.Column<int>(type: "int", nullable: false),
                    MenuId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuMenuItems", x => new { x.MenuId, x.MenuItemId });
                    table.ForeignKey(
                        name: "FK_MenuMenuItems_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuMenuItems_Menus_MenuId",
                        column: x => x.MenuId,
                        principalTable: "Menus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_ParentKey",
                table: "MenuItems",
                column: "ParentKey");

            migrationBuilder.CreateIndex(
                name: "IX_MenuMenuItems_MenuItemId",
                table: "MenuMenuItems",
                column: "MenuItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuMenuItems");

            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.RenameColumn(
                name: "Position",
                table: "Menus",
                newName: "Url");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 16, 57, 17, 351, DateTimeKind.Local).AddTicks(9143),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 19, 31, 57, 814, DateTimeKind.Local).AddTicks(5160));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 5, 16, 57, 17, 351, DateTimeKind.Local).AddTicks(8336),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 5, 19, 31, 57, 814, DateTimeKind.Local).AddTicks(4719));

            migrationBuilder.AddColumn<byte>(
                name: "Level",
                table: "Menus",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<int>(
                name: "OrderWithinParent",
                table: "Menus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentKey",
                table: "Menus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PostCount",
                table: "Menus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Menus_ParentKey",
                table: "Menus",
                column: "ParentKey");

            migrationBuilder.AddForeignKey(
                name: "FK_Menus_Menus_ParentKey",
                table: "Menus",
                column: "ParentKey",
                principalTable: "Menus",
                principalColumn: "Id");
        }
    }
}
