# Todo API - NestJS + GraphQL + Prisma

このAPIはNestJS、GraphQL、Prismaを使用したTodoアプリケーションのバックエンドです。
JWT認証とロールベースのアクセス制御(RBAC)を実装しています。

## 技術スタック

- **NestJS**: Node.jsフレームワーク
- **GraphQL**: Apollo Server (Code First Approach)
- **Prisma**: ORMとデータベースマイグレーション
- **PostgreSQL**: データベース
- **JWT**: 認証
- **bcrypt**: パスワードハッシュ化

## セットアップ

### 1. 依存関係のインストール

```bash
yarn install
```

### 2. 環境変数の設定

`.env`ファイルを作成してください:

```env
DATABASE_URL="postgresql://todouser:todopass@localhost:5432/tododb"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRATION="1d"
```

### 3. データベース起動

プロジェクトルートで:

```bash
docker-compose up -d
```

### 4. Prismaマイグレーション

```bash
yarn prisma migrate dev
```

### 5. アプリケーション起動

```bash
yarn start:dev
```

サーバーは `http://localhost:4001` で起動します。
GraphQL Playground: `http://localhost:4001/graphql`

## データベーススキーマ

### User
- `id`: Int (Primary Key)
- `email`: String (Unique)
- `password`: String (ハッシュ化済み)
- `role`: Role (USER | ADMIN)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Category
- `id`: Int (Primary Key)
- `name`: String (Unique)
- `description`: String (Nullable)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Todo
- `id`: Int (Primary Key)
- `title`: String
- `description`: String (Nullable)
- `status`: TodoStatus (PENDING | IN_PROGRESS | COMPLETED)
- `userId`: Int (Foreign Key)
- `categoryId`: Int (Foreign Key, Nullable)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## GraphQL API

### 認証 (Auth)

#### ユーザー登録
```graphql
mutation {
  signup(signupInput: {
    email: "user@example.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      email
      role
    }
  }
}
```

#### ログイン
```graphql
mutation {
  login(loginInput: {
    email: "user@example.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      email
      role
    }
  }
}
```

#### 現在のユーザー情報取得
```graphql
query {
  me {
    id
    email
    role
  }
}
```
**注**: JWTトークンが必要です。Headerに `Authorization: Bearer <token>` を設定してください。

### カテゴリ (Categories) - 管理者のみ

#### カテゴリ作成 (ADMIN のみ)
```graphql
mutation {
  createCategory(createCategoryInput: {
    name: "Work"
    description: "Work related tasks"
  }) {
    id
    name
    description
  }
}
```

#### カテゴリ一覧取得
```graphql
query {
  categories {
    id
    name
    description
  }
}
```

#### カテゴリ更新 (ADMIN のみ)
```graphql
mutation {
  updateCategory(updateCategoryInput: {
    id: 1
    name: "Personal"
  }) {
    id
    name
    description
  }
}
```

#### カテゴリ削除 (ADMIN のみ)
```graphql
mutation {
  removeCategory(id: 1) {
    id
    name
  }
}
```

### Todo (Todos) - 作成者本人のみ

#### Todo作成
```graphql
mutation {
  createTodo(createTodoInput: {
    title: "Buy groceries"
    description: "Milk, eggs, bread"
    categoryId: 1
  }) {
    id
    title
    description
    status
    category {
      name
    }
  }
}
```

#### 自分のTodo一覧取得
```graphql
query {
  todos {
    id
    title
    description
    status
    category {
      name
    }
  }
}
```

#### Todo更新 (自分のもののみ)
```graphql
mutation {
  updateTodo(updateTodoInput: {
    id: 1
    status: COMPLETED
  }) {
    id
    title
    status
  }
}
```

#### Todo削除 (自分のもののみ)
```graphql
mutation {
  removeTodo(id: 1) {
    id
    title
  }
}
```

## 権限とアクセス制御

### ロール
- **USER**: 通常ユーザー（デフォルト）
- **ADMIN**: 管理者

### アクセスルール

1. **Categories**: すべての変更操作（作成・更新・削除）はADMINのみ可能
2. **Todos**: ユーザーは自分が作成したTodoのみアクセス・変更可能

### ADMIN ユーザーの作成

データベースに直接挿入する必要があります:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

または、Prisma Studioを使用:

```bash
yarn prisma studio
```

## 開発コマンド

```bash
# 開発サーバー起動
yarn start:dev

# 本番ビルド
yarn build

# 本番サーバー起動
yarn start:prod

# Prisma Studio起動
yarn prisma studio

# マイグレーション作成
yarn prisma migrate dev --name migration_name

# Prisma Client再生成
yarn prisma generate
```

## テスト

GraphQL Playgroundで手動テスト、またはE2Eテストを実装してください:

```bash
yarn test:e2e
```

## 注意事項

1. 本番環境では必ず `JWT_SECRET` を強力なランダム文字列に変更してください
2. CORS設定は必要に応じて `main.ts` で設定してください
3. Rate limitingやその他のセキュリティ対策を追加することを推奨します
