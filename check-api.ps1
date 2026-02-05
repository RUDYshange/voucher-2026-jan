$body = @{
    customerName = "Test Check"
    customerEmail = "check@example.com"
    totalAmount = 0
    items = @()
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/orders" -ContentType "application/json" -Body $body
    Write-Host "Success! Response:"
    $response | Format-List
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
        Write-Host "Response Body: $content"
    }
}
