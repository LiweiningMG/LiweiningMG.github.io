Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$imageRoot = Join-Path $root 'images'
$outputRoot = Join-Path $imageRoot 'interest-collages'
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

$sportsTitle = -join @([char]0x8FD0, [char]0x52A8)
$cookingTitle = -join @([char]0x70F9, [char]0x996A)
$travelTitle = -join @([char]0x65C5, [char]0x884C)
$sportsSubtitle = -join @([char]0x8DD1, [char]0x6B65, ' | ', [char]0x7403, [char]0x7C7B, ' | ', [char]0x9A91, [char]0x884C)
$cookingSubtitle = -join @([char]0x5BB6, [char]0x5E38, [char]0x83DC, ' | ', [char]0x70D8, [char]0x7119, ' | ', [char]0x4E00, [char]0x9910, [char]0x4E00, [char]0x5473)
$travelSubtitle = -join @([char]0x770B, [char]0x98CE, [char]0x666F, ' | ', [char]0x5403, [char]0x5F53, [char]0x5730, [char]0x83DC, ' | ', [char]0x8BA4, [char]0x8BC6, [char]0x5F53, [char]0x5730, [char]0x4EBA)

$sets = @(
  @{ Name = $sportsTitle; File = 'sports-collage.jpg'; Subtitle = $sportsSubtitle; Images = @('personal-life/running-total.jpg', 'personal-life/badminton-2.jpg', 'personal-life/pingpong-1.jpg', 'personal-life/cycling-2.jpeg') },
  @{ Name = $cookingTitle; File = 'cooking-collage.jpg'; Subtitle = $cookingSubtitle; Images = @('personal-life/cooking-cn.jpg', 'personal-life/baking-2.jpg', 'personal-life/food-cn-11.jpg', 'personal-life/food-west-6.jpg') },
  @{ Name = $travelTitle; File = 'travel-collage.jpg'; Subtitle = $travelSubtitle; Images = @('home-page-2.jpg', 'home-page-4.jpg', 'home-page-5.jpg', 'home-page-6.jpg') }
)

function Draw-CoverImage {
  param([System.Drawing.Graphics] $Graphics, [string] $Path, [System.Drawing.Rectangle] $Destination)
  $source = [System.Drawing.Image]::FromFile($Path)
  try {
    $scale = [Math]::Max($Destination.Width / $source.Width, $Destination.Height / $source.Height)
    $drawWidth = [int][Math]::Ceiling($source.Width * $scale)
    $drawHeight = [int][Math]::Ceiling($source.Height * $scale)
    $x = $Destination.X - [int](($drawWidth - $Destination.Width) / 2)
    $y = $Destination.Y - [int](($drawHeight - $Destination.Height) / 2)
    $Graphics.DrawImage($source, (New-Object System.Drawing.Rectangle($x, $y, $drawWidth, $drawHeight)))
  }
  finally { $source.Dispose() }
}

foreach ($set in $sets) {
  $canvas = New-Object System.Drawing.Bitmap 1800, 1800
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.Clear([System.Drawing.Color]::FromArgb(249, 247, 243))
  $titleFont = New-Object System.Drawing.Font('Microsoft YaHei UI', 62, [System.Drawing.FontStyle]::Bold)
  $subtitleFont = New-Object System.Drawing.Font('Microsoft YaHei UI', 26)
  $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(43, 42, 40))
  $subtitleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(107, 102, 94))
  try {
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString($set.Name, $titleFont, $titleBrush, (New-Object System.Drawing.RectangleF(0, 42, 1800, 75)), $format)
    $graphics.DrawString($set.Subtitle, $subtitleFont, $subtitleBrush, (New-Object System.Drawing.RectangleF(0, 124, 1800, 42)), $format)
    $positions = @(
      (New-Object System.Drawing.Rectangle(48, 214, 838, 738)),
      (New-Object System.Drawing.Rectangle(914, 214, 838, 738)),
      (New-Object System.Drawing.Rectangle(48, 980, 838, 738)),
      (New-Object System.Drawing.Rectangle(914, 980, 838, 738))
    )
    for ($i = 0; $i -lt $set.Images.Count; $i++) {
      $imagePath = Join-Path $imageRoot $set.Images[$i]
      Draw-CoverImage -Graphics $graphics -Path $imagePath -Destination $positions[$i]
    }
    $savePath = Join-Path $outputRoot $set.File
    $canvas.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  }
  finally {
    $titleFont.Dispose(); $subtitleFont.Dispose(); $titleBrush.Dispose(); $subtitleBrush.Dispose()
    $graphics.Dispose(); $canvas.Dispose()
  }
}
