# 🧪 QA Automation Test Suite

This repository contains a comprehensive **QA Automation Test Suite** including:
- 🎭 **Playwright E2E UI Automation** (TypeScript)
- 📮 **Postman API Automation** (REST API Testing)
- 📝 **Manual Test Cases** (Excel Documentation)
- 🎁 **Bonus Tasks** (Additional assignments)

---

## 📂 Repository Structure

```
├── API_Automation_With_POSTMAN/
│   └── API Automation (Postman).postman_collection.json
├── Bonus_Task/
│   └── [Bonus task PDFs]
├── Manual_Test_Case_Creation/
│   └── DemoWebShop_Manual_Test_Cases.xlsx
├── src/
│   ├── components/
│   │   ├── navbar.ts
│   ├── pages/
│   │   ├── LandingPage.ts
│   │   ├── ProductPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   └── types/
│       ├── product-options.ts
│       └── checkout-options.ts
├── test-data/
│   ├── product.json
│   ├── category-product.json
│   └── checkout.json
├── tests/
│   └── place-order.spec.ts
├── .env
├── package.json
├── playwright.config.ts
└── README.md
```

---

## 🎭 Playwright E2E UI Automation

### Overview

End-to-End UI Automation Framework built with **Playwright (TypeScript)** using the **Page Object Model (POM)** pattern. Automates user interactions including login, adding products to cart, verifying cart totals, and checkout.

### Features

- ✅ **Playwright Test Runner**
- ✅ **Page Object Model (POM)** architecture
- ✅ **External Test Data** via JSON files
- ✅ **Environment Variables** support
- ✅ **Serial E2E Flows** for:
  - Adding featured products
  - Adding category-based products
  - Verifying cart price calculations
  - Completing checkout

### 🚀 Getting Started

#### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Install Playwright Browsers

```bash
npx playwright install
```

#### 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
```

**📥 Request Credentials:**

📧 **Email:** [tanweer6917@gmail.com](mailto:tanweer6917@gmail.com?subject=Request%20for%20.env%20Credentials&body=Hi%20Tanweer,%0A%0AI%20would%20like%20to%20request%20the%20.env%20credentials%20file%20for%20the%20Playwright%20E2E%20Automation%20Framework.%0A%0AThank%20you!)  
👤 **Contact:** Tanweer Karim

### ▶️ Running Playwright Tests

```bash
# Run all tests
npx playwright test

# Run with UI Mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/place-order.spec.ts

# Run in headed mode
npx playwright test --headed

# Generate HTML Report
npx playwright show-report
```

### 🧪 What the Tests Do

**Test 1: Add All Featured Products**
- Opens each featured product
- Adds items to cart
- Validates cart totals
- Proceeds to checkout
- Completes order

**Test 2: Add Category-Based Products**
- Iterates through categories and products
- Adds each product to cart
- Validates total pricing
- Completes checkout

---

## 📮 API Automation with Postman

### Overview

REST API testing collection for **Petstore Swagger API** covering positive and negative test scenarios for pet creation and retrieval.

### Location

📁 **Collection File:** `API_Automation_With_POSTMAN/API Automation (Postman).postman_collection.json`

### API Endpoints Covered

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pet` | POST | Create a new pet (valid & invalid) |
| `/pet/{petId}` | GET | Retrieve pet by ID (valid & invalid) |

### Test Scenarios

✅ **Create Pet - Valid POST**
- Generates random pet ID
- Creates pet with valid data
- Validates response status (200)
- Verifies pet ID and name match

✅ **Get Pet - Valid GET**
- Retrieves existing pet
- Validates response status (200)
- Confirms returned pet ID matches request

❌ **Get Pet - Invalid GET**
- Attempts to retrieve non-existent pet
- Validates 404 status code
- Checks error message contains "not found"

❌ **Create Pet - Invalid POST**
- Sends POST request without body
- Validates 405 status code (Method Not Allowed)

### 🚀 How to Run Postman Collection

#### Method 1: Import via Postman App

1. **Open Postman** desktop application or web version
2. Click **"Import"** button (top-left corner)
3. Select **"Upload Files"**
4. Navigate to: `API_Automation_With_POSTMAN/API Automation (Postman).postman_collection.json`
5. Click **"Import"**

#### Method 2: Import via Drag & Drop

1. Open **Postman**
2. Drag and drop the `API Automation (Postman).postman_collection.json` file into the Postman window
3. Collection will be automatically imported

#### Running the Collection

**Option A: Run Individual Requests**
1. Expand the imported collection in left sidebar
2. Select any request (e.g., "Create Pet Valid Post")
3. Click **"Send"** button
4. View response and test results in the bottom panel

**Option B: Run Entire Collection**
1. Click the **three dots (•••)** next to the collection name
2. Select **"Run collection"**
3. Configure run settings:
   - Select all requests or specific ones
   - Set iterations (default: 1)
   - Set delay between requests (optional)
4. Click **"Run API Automation (Postman)"**
5. View test results in the Collection Runner window

#### Collection Variables

The collection uses these variables (auto-configured):

| Variable | Description | Value |
|----------|-------------|-------|
| `base_url` | API base URL | `https://petstore.swagger.io/v2` |
| `petId` | Auto-generated pet ID | Random 6-digit number |
| `petId_not_exist` | Non-existent pet ID | Random 7-digit number |

**Note:** Variables are managed automatically by pre-request scripts. No manual configuration needed.

#### Viewing Test Results

After running requests:
- ✅ **Test Results** tab shows passed/failed assertions
- 📊 **Test Scripts** validate:
  - Response status codes
  - Response body structure
  - Data integrity
  - Error handling

---

## 📝 Manual Test Cases

### Location

📁 **Excel File:** `Manual_Test_Case_Creation/DemoWebShop_Manual_Test_Cases.xlsx`

### Contents

Comprehensive manual test cases for **DemoWebShop** application covering:
- User registration and login flows
- Product browsing and search
- Cart operations
- Checkout process
- Edge cases and negative scenarios

### How to Use

1. Open the Excel file
2. Review test case structure:
   - Test Case ID
   - Test Description
   - Pre-conditions
   - Test Steps
   - Expected Results
   - Actual Results
   - Status (Pass/Fail)
3. Execute tests manually following the documented steps
4. Record results in the "Actual Results" column

---

## 🎁 Bonus Tasks

### Location

📁 **Folder:** `Bonus_Task/`

Contains additional assignment PDFs with supplementary tasks and documentation.

---

## 🧰 Requirements

### For Playwright Tests
- **Node.js** v18+
- **Playwright** (`npx playwright install`)
- `.env` file with valid credentials

### For API Tests
- **Postman** desktop app or web version
- Internet connection (API endpoint access)

### For Manual Tests
- **Microsoft Excel** or compatible spreadsheet software

---

## 🛠️ Troubleshooting

### Playwright Issues

**Tests fail with "USER_EMAIL is not defined"**
- Ensure `.env` file exists in root directory with required variables

**Browser not launching**
- Run `npx playwright install` to download browsers

**Tests timing out**
- Check network connection
- Adjust timeout settings in `playwright.config.ts`

### Postman Issues

**Collection won't import**
- Ensure you're using the correct file path
- Verify Postman version is up to date
- Try importing via "Import from Link" if file import fails

**Tests failing with network errors**
- Check internet connection
- Verify API endpoint is accessible: https://petstore.swagger.io/v2/pet
- Disable VPN if causing connectivity issues

**Variables not set correctly**
- Clear environment variables and re-run collection
- Check pre-request scripts are enabled in Postman settings

---

## 💡 Best Practices

- 🔒 **Never commit `.env` files** to version control
- 📝 Keep test data updated in JSON files
- 🧹 Run tests in isolation to avoid side effects
- 📊 Review test reports after each run
- 🔄 Update manual test cases based on application changes

---

## 📬 Support

For assistance or questions:

📧 **Contact:** [tanweer6917@gmail.com](mailto:tanweer6917@gmail.com)  
👤 **Maintainer:** Tanweer Karim

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgments

- Built with ❤️ using [Playwright](https://playwright.dev/)
- API testing powered by [Postman](https://www.postman.com/)
- Test API: [Petstore Swagger](https://petstore.swagger.io/)

---

**Happy Testing! 🚀**