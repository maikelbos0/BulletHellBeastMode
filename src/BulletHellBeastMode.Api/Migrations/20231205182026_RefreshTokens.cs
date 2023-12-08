using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BulletHellBeastMode.Api.Migrations
{
    /// <inheritdoc />
    public partial class RefreshTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RefreshTokenFamily",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Expires = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokenFamily", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokenFamily_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UsedRefreshToken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefreshTokenFamilyId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsedRefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsedRefreshToken_RefreshTokenFamily_RefreshTokenFamilyId",
                        column: x => x.RefreshTokenFamilyId,
                        principalTable: "RefreshTokenFamily",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokenFamily_UserId",
                table: "RefreshTokenFamily",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UsedRefreshToken_RefreshTokenFamilyId",
                table: "UsedRefreshToken",
                column: "RefreshTokenFamilyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UsedRefreshToken");

            migrationBuilder.DropTable(
                name: "RefreshTokenFamily");
        }
    }
}
