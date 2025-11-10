# Todo App with JWT Authentication

Full-stack Todoアプリケーションで、JWT認証とロールベースのアクセス制御(RBAC)を実装しています。

## プロジェクト構成

```
202511-ts-auth/
├── api/                  # NestJS + GraphQL + Prisma バックエンド
├── front/                # Next.js フロントエンド (実装予定)
├── docker-compose.yml    # PostgreSQL データベース設定
├── .env.example          # 環境変数のサンプル
└── README.md             # このファイル
```

## 技術スタック

### バックエンド
- **NestJS**: Node.jsフレームワーク
- **GraphQL**: Apollo Server (Code First)
- **Prisma**: ORM
- **PostgreSQL**: データベース
- **JWT**: 認証
- **bcrypt**: パスワードハッシュ化

### フロントエンド (実装予定)
- **Next.js**: Reactフレームワーク
- **Apollo Client**: GraphQLクライアント
- **TailwindCSS**: スタイリング

## クイックスタート

### 1. PostgreSQLデータベースの起動

```bash
docker-compose up -d
```

### 2. バックエンドのセットアップ

```bash
cd api/api

# 依存関係のインストール
yarn install

# 環境変数の設定
# .env ファイルは既に存在します

# データベースマイグレーション
yarn prisma migrate dev

# サーバー起動
yarn start:dev
```

サーバーは `http://localhost:3000` で起動します。
GraphQL Playground: `http://localhost:3000/graphql`

### 3. API のテスト

詳細なAPI仕様は `api/README.md` を参照してください。

## 主要機能

### 認証・認可
- **JWT認証**: トークンベースの認証システム
- **ロールベースアクセス制御**:
  - `USER`: 通常ユーザー（自分のTodoのみ管理可能）
  - `ADMIN`: 管理者（カテゴリ管理が可能）

### データモデル
- **User**: ユーザー情報（email, password, role）
- **Category**: Todoのカテゴリ（管理者のみ編集可能）
- **Todo**: Todoアイテム（タイトル、説明、ステータス、カテゴリ）

### アクセスルール
1. **Categories**: 作成・更新・削除は ADMINのみ
2. **Todos**: 作成者本人のみ操作可能

## ドキュメント

- [API詳細ドキュメント](api/README.md)
- [開発ガイド (CLAUDE.md)](CLAUDE.md)
