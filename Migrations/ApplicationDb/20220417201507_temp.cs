using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class temp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 17, 22, 15, 7, 514, DateTimeKind.Local).AddTicks(8306),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(5509));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 17, 22, 15, 7, 514, DateTimeKind.Local).AddTicks(7696),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(4488));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(5509),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 17, 22, 15, 7, 514, DateTimeKind.Local).AddTicks(8306));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 16, 17, 29, 59, 19, DateTimeKind.Local).AddTicks(4488),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 17, 22, 15, 7, 514, DateTimeKind.Local).AddTicks(7696));
        }
    }
}
