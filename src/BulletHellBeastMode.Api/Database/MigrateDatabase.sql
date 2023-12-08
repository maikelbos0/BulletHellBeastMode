IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231130195936_Users'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [PasswordHash] varbinary(max) NOT NULL,
        [Salt] varbinary(max) NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231130195936_Users'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231130195936_Users', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201090539_UserEvents'
)
BEGIN
    CREATE TABLE [UserEvent] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [DateTime] datetimeoffset NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_UserEvent] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserEvent_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201090539_UserEvents'
)
BEGIN
    CREATE INDEX [IX_UserEvent_UserId] ON [UserEvent] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201090539_UserEvents'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231201090539_UserEvents', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201105637_User-SerializedPassword'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'PasswordHash');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Users] DROP COLUMN [PasswordHash];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201105637_User-SerializedPassword'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Salt');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Users] DROP COLUMN [Salt];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201105637_User-SerializedPassword'
)
BEGIN
    ALTER TABLE [Users] ADD [Password] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231201105637_User-SerializedPassword'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231201105637_User-SerializedPassword', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231203075750_User-NotNullPassword'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Password');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var2 + '];');
    EXEC(N'UPDATE [Users] SET [Password] = N'''' WHERE [Password] IS NULL');
    ALTER TABLE [Users] ALTER COLUMN [Password] nvarchar(max) NOT NULL;
    ALTER TABLE [Users] ADD DEFAULT N'' FOR [Password];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231203075750_User-NotNullPassword'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231203075750_User-NotNullPassword', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231203112646_User-UniqueName'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Name');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [Users] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231203112646_User-UniqueName'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Name] ON [Users] ([Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231203112646_User-UniqueName'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231203112646_User-UniqueName', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231205182026_RefreshTokens'
)
BEGIN
    CREATE TABLE [RefreshTokenFamily] (
        [Id] int NOT NULL IDENTITY,
        [Token] nvarchar(max) NOT NULL,
        [Expires] datetimeoffset NOT NULL,
        [UserId] int NULL,
        CONSTRAINT [PK_RefreshTokenFamily] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RefreshTokenFamily_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231205182026_RefreshTokens'
)
BEGIN
    CREATE TABLE [UsedRefreshToken] (
        [Id] int NOT NULL IDENTITY,
        [Token] nvarchar(max) NOT NULL,
        [RefreshTokenFamilyId] int NULL,
        CONSTRAINT [PK_UsedRefreshToken] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UsedRefreshToken_RefreshTokenFamily_RefreshTokenFamilyId] FOREIGN KEY ([RefreshTokenFamilyId]) REFERENCES [RefreshTokenFamily] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231205182026_RefreshTokens'
)
BEGIN
    CREATE INDEX [IX_RefreshTokenFamily_UserId] ON [RefreshTokenFamily] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231205182026_RefreshTokens'
)
BEGIN
    CREATE INDEX [IX_UsedRefreshToken_RefreshTokenFamilyId] ON [UsedRefreshToken] ([RefreshTokenFamilyId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231205182026_RefreshTokens'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231205182026_RefreshTokens', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [RefreshTokenFamily] DROP CONSTRAINT [FK_RefreshTokenFamily_Users_UserId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UsedRefreshToken] DROP CONSTRAINT [FK_UsedRefreshToken_RefreshTokenFamily_RefreshTokenFamilyId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UserEvent] DROP CONSTRAINT [FK_UserEvent_Users_UserId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UserEvent] DROP CONSTRAINT [PK_UserEvent];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UsedRefreshToken] DROP CONSTRAINT [PK_UsedRefreshToken];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [RefreshTokenFamily] DROP CONSTRAINT [PK_RefreshTokenFamily];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    EXEC sp_rename N'[UserEvent]', N'UserEvents';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    EXEC sp_rename N'[UsedRefreshToken]', N'UsedRefreshTokens';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    EXEC sp_rename N'[RefreshTokenFamily]', N'RefreshTokenFamilies';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    EXEC sp_rename N'[UserEvents].[IX_UserEvent_UserId]', N'IX_UserEvents_UserId', N'INDEX';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    EXEC sp_rename N'[UsedRefreshTokens].[IX_UsedRefreshToken_RefreshTokenFamilyId]', N'IX_UsedRefreshTokens_RefreshTokenFamilyId', N'INDEX';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    EXEC sp_rename N'[RefreshTokenFamilies].[IX_RefreshTokenFamily_UserId]', N'IX_RefreshTokenFamilies_UserId', N'INDEX';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UserEvents] ADD CONSTRAINT [PK_UserEvents] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UsedRefreshTokens] ADD CONSTRAINT [PK_UsedRefreshTokens] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [RefreshTokenFamilies] ADD CONSTRAINT [PK_RefreshTokenFamilies] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [RefreshTokenFamilies] ADD CONSTRAINT [FK_RefreshTokenFamilies_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UsedRefreshTokens] ADD CONSTRAINT [FK_UsedRefreshTokens_RefreshTokenFamilies_RefreshTokenFamilyId] FOREIGN KEY ([RefreshTokenFamilyId]) REFERENCES [RefreshTokenFamilies] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    ALTER TABLE [UserEvents] ADD CONSTRAINT [FK_UserEvents_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20231208100157_Plural-TableNames'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20231208100157_Plural-TableNames', N'8.0.0');
END;
GO

COMMIT;
GO

