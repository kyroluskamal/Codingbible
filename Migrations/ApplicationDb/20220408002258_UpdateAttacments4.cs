using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodingBible.Migrations.ApplicationDb
{
    public partial class UpdateAttacments4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 8, 2, 22, 57, 962, DateTimeKind.Local).AddTicks(5288),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 7, 23, 40, 7, 773, DateTimeKind.Local).AddTicks(4413));

            migrationBuilder.AlterColumn<string>(
                name: "FeatureImageUrl",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 8, 2, 22, 57, 962, DateTimeKind.Local).AddTicks(4579),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 7, 23, 40, 7, 773, DateTimeKind.Local).AddTicks(3505));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LasModified",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 7, 23, 40, 7, 773, DateTimeKind.Local).AddTicks(4413),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 8, 2, 22, 57, 962, DateTimeKind.Local).AddTicks(5288));

            migrationBuilder.AlterColumn<string>(
                name: "FeatureImageUrl",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 7, 23, 40, 7, 773, DateTimeKind.Local).AddTicks(3505),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 8, 2, 22, 57, 962, DateTimeKind.Local).AddTicks(4579));
        }
    }
}
