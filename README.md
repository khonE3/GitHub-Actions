# 🚀 GitHub Actions

https://khone3.github.io/GitHub-Actions/

> **สรุปเนื้อหา GitHub Actions** — ระบบ CI/CD อัตโนมัติที่อยู่ใน GitHub  
> พร้อมตัวอย่างและ Best Practices

---

## 📖 สารบัญ

1. [GitHub Actions คืออะไร?](#-github-actions-คืออะไร)
2. [Core Concepts](#-core-concepts)
3. [Workflow Syntax](#-workflow-syntax)
4. [Events & Triggers](#-events--triggers)
5. [Jobs & Steps](#-jobs--steps)
6. [Actions Marketplace](#-actions-marketplace)
7. [Secrets & Variables](#-secrets--variables)
8. [Environments](#-environments)
9. [Matrix Strategy](#-matrix-strategy)
10. [Caching & Artifacts](#-caching--artifacts)
11. [Best Practices](#-best-practices)

---

## 🤔 GitHub Actions คืออะไร?

GitHub Actions คือ **CI/CD platform** ที่ built-in อยู่ใน GitHub ช่วยให้เราสามารถ **automate workflows** ต่างๆ ได้ เช่น build, test, deploy โค้ดอัตโนมัติ เมื่อเกิด event บน repository

### จุดเด่น

- ✅ ใช้งานฟรีสำหรับ public repos
- ✅ รองรับ Linux, macOS, Windows runners
- ✅ มี Marketplace ที่มี Actions สำเร็จรูปกว่า 15,000+
- ✅ รองรับ Matrix builds สำหรับทดสอบหลาย environments
- ✅ Secrets management built-in

---

## 🧩 Core Concepts

| Concept      | คำอธิบาย                                                |
| ------------ | ------------------------------------------------------- |
| **Workflow** | กระบวนการอัตโนมัติที่กำหนดใน YAML file                  |
| **Event**    | สิ่งที่ trigger workflow เช่น push, pull_request        |
| **Job**      | ชุดของ steps ที่ทำงานบน runner เดียวกัน                 |
| **Step**     | task ย่อยใน job (run command หรือใช้ action)            |
| **Action**   | custom application ที่ reusable ได้                     |
| **Runner**   | server ที่รัน workflow (GitHub-hosted หรือ self-hosted) |

```
Repository Event ──► Workflow ──► Job(s) ──► Step(s) ──► Action(s)
     │                  │           │          │
   push/PR         .yml file    runner     commands
```

---

## 📝 Workflow Syntax

Workflow files อยู่ที่ `.github/workflows/*.yml`

```yaml
name: CI Pipeline # ชื่อ workflow

on: # Events ที่ trigger
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions: # กำหนดสิทธิ์
  contents: read

jobs: # รายการ jobs
  build:
    runs-on: ubuntu-latest # runner ที่ใช้

    steps:
      - name: Checkout code
        uses: actions/checkout@v4 # ใช้ action สำเร็จรูป

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci # รัน command

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

---

## ⚡ Events & Triggers

### Push & Pull Request

```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - "src/**" # trigger เมื่อไฟล์ใน src/ เปลี่ยน
    tags:
      - "v*" # trigger เมื่อ push tag v*

  pull_request:
    types: [opened, synchronize, reopened]
```

### Schedule (Cron)

```yaml
on:
  schedule:
    - cron: "0 2 * * 1" # ทุกวันจันทร์ เวลา 02:00 UTC
```

### Manual (workflow_dispatch)

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production
```

### Other Events

- `release` — เมื่อมี release ใหม่
- `issues` — เมื่อมี issue ถูกสร้าง/แก้ไข
- `workflow_call` — เรียกจาก workflow อื่น (reusable)
- `repository_dispatch` — trigger จาก API ภายนอก

---

## 🔧 Jobs & Steps

### Job Dependencies

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  build:
    needs: test # รอ test เสร็จก่อน
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build

  deploy:
    needs: [test, build] # รอทั้ง test และ build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' # deploy เฉพาะ main
    steps:
      - run: echo "Deploying..."
```

### Conditional Steps

```yaml
steps:
  - name: Deploy to production
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    run: ./deploy.sh

  - name: Notify on failure
    if: failure()
    run: echo "Build failed!"
```

### Job Outputs

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.get_version.outputs.version }}
    steps:
      - id: get_version
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT

  deploy:
    needs: prepare
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying v${{ needs.prepare.outputs.version }}"
```

---

## 🏪 Actions Marketplace

### Popular Actions

| Action                         | ใช้ทำอะไร              |
| ------------------------------ | ---------------------- |
| `actions/checkout@v4`          | Clone repository       |
| `actions/setup-node@v4`        | ติดตั้ง Node.js        |
| `actions/setup-python@v5`      | ติดตั้ง Python         |
| `actions/cache@v4`             | Cache dependencies     |
| `actions/upload-artifact@v4`   | Upload build artifacts |
| `actions/download-artifact@v4` | Download artifacts     |
| `actions/deploy-pages@v4`      | Deploy to GitHub Pages |

### Custom Action (Composite)

```yaml
# .github/actions/greeting/action.yml
name: "Greeting Action"
description: "Greet someone"
inputs:
  who-to-greet:
    description: "Who to greet"
    required: true
    default: "World"
outputs:
  time:
    description: "The greeting time"
    value: ${{ steps.greeting.outputs.time }}
runs:
  using: "composite"
  steps:
    - run: echo "Hello ${{ inputs.who-to-greet }}!"
      shell: bash
    - id: greeting
      run: echo "time=$(date)" >> $GITHUB_OUTPUT
      shell: bash
```

---

## 🔐 Secrets & Variables

### Secrets (ข้อมูลลับ)

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: ./deploy.sh
```

### Variables (ค่าที่ไม่ลับ)

```yaml
steps:
  - name: Show config
    env:
      APP_ENV: ${{ vars.APP_ENV }}
    run: echo "Environment: $APP_ENV"
```

### GITHUB_TOKEN (Built-in)

```yaml
steps:
  - name: Create Release
    uses: actions/create-release@v1
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> ⚠️ **หมายเหตุ**: Secrets จะถูก mask ใน logs อัตโนมัติ ไม่สามารถอ่านค่าได้โดยตรง

---

## 🌍 Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - run: echo "Deploy to staging"

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - run: echo "Deploy to production"
```

### Environment Features

- 🛡️ **Protection rules** — ต้องมีคน approve ก่อน deploy
- ⏰ **Wait timer** — รอเวลาที่กำหนดก่อน deploy
- 🔑 **Environment secrets** — secrets เฉพาะ environment
- 🌿 **Branch policies** — จำกัด branch ที่ deploy ได้

---

## 🔄 Matrix Strategy

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20, 22]
        exclude:
          - os: macos-latest
            node-version: 18
        include:
          - os: ubuntu-latest
            node-version: 22
            experimental: true
      fail-fast: false # ไม่หยุดถ้า job อื่น fail

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

---

## 📦 Caching & Artifacts

### Caching Dependencies

```yaml
steps:
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

### Upload/Download Artifacts

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
          retention-days: 7

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: ./deploy.sh
```

---

## ✅ Best Practices

### 1. Security

- 🔒 ใช้ pinned versions สำหรับ actions (`@v4` หรือ commit SHA)
- 🔒 กำหนด `permissions` ให้น้อยที่สุด (principle of least privilege)
- 🔒 อย่า hardcode secrets ใน workflow files
- 🔒 ใช้ `CODEOWNERS` เพื่อควบคุมการแก้ไข workflow

### 2. Performance

- ⚡ ใช้ caching สำหรับ dependencies
- ⚡ ใช้ `paths` filter เพื่อ trigger เฉพาะเมื่อจำเป็น
- ⚡ ใช้ `concurrency` เพื่อยกเลิก runs ที่ซ้ำ
- ⚡ แยก jobs ออกเพื่อรัน parallel ได้

### 3. Maintainability

- 📋 ใช้ reusable workflows สำหรับ logic ที่ซ้ำกัน
- 📋 ใช้ composite actions สำหรับ steps ที่ใช้บ่อย
- 📋 เขียน comments ใน workflow files
- 📋 ใช้ meaningful names สำหรับ jobs และ steps

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true # ยกเลิก run เก่าถ้ามี run ใหม่
```

---

## 🌐 Website

ดูเว็บสรุป GitHub Actions แบบ interactive ได้ที่ `index.html` ในโปรเจคนี้

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Starter Workflows](https://github.com/actions/starter-workflows)

---

<p align="center">Made with ❤️ for learning GitHub Actions</p>
