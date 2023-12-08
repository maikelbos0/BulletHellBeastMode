using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BulletHellBeastMode.Api.Migrations
{
    /// <inheritdoc />
    public partial class PluralTableNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokenFamily_Users_UserId",
                table: "RefreshTokenFamily");

            migrationBuilder.DropForeignKey(
                name: "FK_UsedRefreshToken_RefreshTokenFamily_RefreshTokenFamilyId",
                table: "UsedRefreshToken");

            migrationBuilder.DropForeignKey(
                name: "FK_UserEvent_Users_UserId",
                table: "UserEvent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEvent",
                table: "UserEvent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UsedRefreshToken",
                table: "UsedRefreshToken");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RefreshTokenFamily",
                table: "RefreshTokenFamily");

            migrationBuilder.RenameTable(
                name: "UserEvent",
                newName: "UserEvents");

            migrationBuilder.RenameTable(
                name: "UsedRefreshToken",
                newName: "UsedRefreshTokens");

            migrationBuilder.RenameTable(
                name: "RefreshTokenFamily",
                newName: "RefreshTokenFamilies");

            migrationBuilder.RenameIndex(
                name: "IX_UserEvent_UserId",
                table: "UserEvents",
                newName: "IX_UserEvents_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UsedRefreshToken_RefreshTokenFamilyId",
                table: "UsedRefreshTokens",
                newName: "IX_UsedRefreshTokens_RefreshTokenFamilyId");

            migrationBuilder.RenameIndex(
                name: "IX_RefreshTokenFamily_UserId",
                table: "RefreshTokenFamilies",
                newName: "IX_RefreshTokenFamilies_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEvents",
                table: "UserEvents",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UsedRefreshTokens",
                table: "UsedRefreshTokens",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RefreshTokenFamilies",
                table: "RefreshTokenFamilies",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokenFamilies_Users_UserId",
                table: "RefreshTokenFamilies",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UsedRefreshTokens_RefreshTokenFamilies_RefreshTokenFamilyId",
                table: "UsedRefreshTokens",
                column: "RefreshTokenFamilyId",
                principalTable: "RefreshTokenFamilies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserEvents_Users_UserId",
                table: "UserEvents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokenFamilies_Users_UserId",
                table: "RefreshTokenFamilies");

            migrationBuilder.DropForeignKey(
                name: "FK_UsedRefreshTokens_RefreshTokenFamilies_RefreshTokenFamilyId",
                table: "UsedRefreshTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_UserEvents_Users_UserId",
                table: "UserEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEvents",
                table: "UserEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UsedRefreshTokens",
                table: "UsedRefreshTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RefreshTokenFamilies",
                table: "RefreshTokenFamilies");

            migrationBuilder.RenameTable(
                name: "UserEvents",
                newName: "UserEvent");

            migrationBuilder.RenameTable(
                name: "UsedRefreshTokens",
                newName: "UsedRefreshToken");

            migrationBuilder.RenameTable(
                name: "RefreshTokenFamilies",
                newName: "RefreshTokenFamily");

            migrationBuilder.RenameIndex(
                name: "IX_UserEvents_UserId",
                table: "UserEvent",
                newName: "IX_UserEvent_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UsedRefreshTokens_RefreshTokenFamilyId",
                table: "UsedRefreshToken",
                newName: "IX_UsedRefreshToken_RefreshTokenFamilyId");

            migrationBuilder.RenameIndex(
                name: "IX_RefreshTokenFamilies_UserId",
                table: "RefreshTokenFamily",
                newName: "IX_RefreshTokenFamily_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEvent",
                table: "UserEvent",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UsedRefreshToken",
                table: "UsedRefreshToken",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RefreshTokenFamily",
                table: "RefreshTokenFamily",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokenFamily_Users_UserId",
                table: "RefreshTokenFamily",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UsedRefreshToken_RefreshTokenFamily_RefreshTokenFamilyId",
                table: "UsedRefreshToken",
                column: "RefreshTokenFamilyId",
                principalTable: "RefreshTokenFamily",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserEvent_Users_UserId",
                table: "UserEvent",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
