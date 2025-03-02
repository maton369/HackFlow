<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite([
            'resources/js/app.jsx',
            'resources/js/Pages/Home.jsx',
            'resources/js/Pages/MyPage.jsx',
            'resources/js/Pages/Projects/Create.jsx',
            'resources/js/Pages/Projects/Show.jsx',
            'resources/js/Pages/Teams/Create.jsx',
            'resources/js/Pages/Teams/Show.jsx',
            'resources/js/Pages/Users/Show.jsx',
            'resources/js/Pages/Auth/Register.jsx',
            'resources/js/Pages/Auth/Login.jsx',
            'resources/js/Pages/Statistics/Index.jsx',
        ])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
