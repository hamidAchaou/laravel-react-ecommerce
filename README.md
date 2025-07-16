# laravel-react-ecommerce

## stape create project

1. install project Laravel
    ```bash
    composer create-project laravel/laravel:^11 app
    cd app
    ```

2. Install Laravel Breeze
```bash
composer require laravel/breeze --dev
```
3. Install Breeze with React + TypeScript
```bash
php artisan breeze:install react --typescript
```
4. Install NPM dependencies and Build Assets
```bash
npm install
npm run dev
```
6. Setup Database
   - Create a database (e.g., my_app) in MySQL or SQLite

   - Update .env file:

```bash
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=app
    DB_USERNAME=root
    DB_PASSWORD=
```
7. Run Migrations
```bash
php artisan migrate
```
8. Serve the App
```bash
php artisan serve
```
9. insall daisyUI and unistall talwindcss Forms
    ```bash
    npm install daisyui
    npm unistall @talwindcss/forms
    ```
10. update file tailwind.config.js
```bash
    plugins: [forms],
```
to 

```bash
plugins: [require("daisyui")],
```

11. install Laravel permssion 
```bash
 composer require spatie/laravel-permission
```    
12. create enum Roles and Permissions 
```bash
php artisan make:enum RolesEnum
php artisan make:enum PermissionsEnum
```
