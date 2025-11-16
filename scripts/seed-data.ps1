# PowerShell script to seed comprehensive learning content
# Run this script to populate your database with 198 learning items

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Seeding Comprehensive Learning Content" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is available
try {
    $null = npx supabase --version
    Write-Host "✓ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "✗ Supabase CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "This will add 198 learning items to your database:" -ForegroundColor Yellow
Write-Host "  - 66 Tutorials (MSL + ASL)" -ForegroundColor White
Write-Host "  - 66 Materials (MSL + ASL)" -ForegroundColor White
Write-Host "  - 66 Quiz Sets (MSL + ASL)" -ForegroundColor White
Write-Host ""
Write-Host "Content breakdown:" -ForegroundColor Yellow
Write-Host "  - Deaf-specific: 66 items" -ForegroundColor White
Write-Host "  - Non-deaf-specific: 66 items" -ForegroundColor White
Write-Host "  - Universal: 66 items" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Do you want to proceed? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Executing seed script..." -ForegroundColor Cyan

# Execute the SQL file
try {
    npx supabase db push --file scripts/seed-comprehensive-learning-content.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ Seed data inserted successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Start your dev server: npm run dev" -ForegroundColor White
        Write-Host "2. Navigate to: http://localhost:3000/dashboard" -ForegroundColor White
        Write-Host "3. Take a proficiency test to see role-specific recommendations" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "✗ Error executing seed script" -ForegroundColor Red
        Write-Host "Please check the error messages above" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "✗ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative method:" -ForegroundColor Yellow
    Write-Host "1. Open Supabase Dashboard SQL Editor" -ForegroundColor White
    Write-Host "2. Copy content from: scripts/seed-comprehensive-learning-content.sql" -ForegroundColor White
    Write-Host "3. Paste and run in SQL Editor" -ForegroundColor White
}
