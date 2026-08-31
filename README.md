texconv
=======

Provides a Node.js API to MS/Intel's `texconv` tool.

Required parameters:
* `in` source file (path or buffer)
* `f` output format (e.g. `DXT5`)
* `ft` output file type (e.g. `DDS`)
Optional parameters:
* Any command-line parameters to `texconv` except file folder/wildcard-related ones
* `verbose` to have texconv output piped to stdout

Example usage:
```javascript
const fs = require('fs');
const texconv = require('texconv');
texconv({
  in: 'file.png',
  f: 'dds',
}, function (err, buffer) {
  if (err) {
    throw err;
  }
  fs.writeFileSync('file.dds', buffer);
  console.log('done!');
});
```

You can also simply get access to the platform-specific binary with `texconv.binary`.

Help output of `texconv` (supported args):
```
   -w <n>              width
   -h <n>              height
   -m <n>              miplevels
   -if <filter>        image filtering
   -srgb{i|o}          sRGB {input, output}
   -ft <filetype>      output file type
   -hflip              horizonal flip of source image
   -vflip              vertical flip of source image
   -sepalpha           resize/generate mips alpha channel separately
                       from color channels
   -nowic              Force non-WIC filtering
   -wrap, -mirror      texture addressing mode (wrap, mirror, or clamp)
   -pmalpha            convert final texture to use premultiplied alpha
   -alpha              convert premultiplied alpha to straight alpha
   -pow2               resize to fit a power-of-2, respecting aspect ratio
   -nmap <options>     converts height-map to normal-map
                       options must be one or more of
                          r, g, b, a, l, m, u, v, i, o
   -nmapamp <weight>   normal map amplitude (defaults to 1.0)
   -fl <feature-level> Set maximum feature level target (defaults to 11.0)

                       (DDS input only)
   -t{u|f}             TYPELESS format is treated as UNORM or FLOAT
   -dword              Use DWORD instead of BYTE alignment
   -badtails           Fix for older DXTn with bad mipchain tails
   -xlum               expand legacy L8, L16, and A8P8 formats

                       (DDS output only)
   -dx10               Force use of 'DX10' extended header

   -singleproc         Do not use multi-threaded compression
   -gpu <adapter>      Select GPU for DirectCompute-based codecs (0 is default)
   -nogpu              Do not use DirectCompute-based codecs
   -bcuniform          Use uniform rather than perceptual weighting for BC1-3
   -bcdither           Use dithering for BC1-3
   -bcmax              Use exhaustive compression (BC7 only)
   -bcquick            Use quick compression (BC7 only)
   -wicq <quality>     When writing images with WIC use quality (0.0 to 1.0)
   -wiclossless        When writing images with WIC use lossless mode
   -wicmulti           When writing images with WIC encode multiframe images
   -aw <weight>        BC7 GPU compressor weighting for alpha error metric
                       (defaults to 1.0)
   -c <hex-RGB>        colorkey (a.k.a. chromakey) transparency
   -rotatecolor <rot>  rotates color primaries and/or applies a curve
   -nits <value>       paper-white value in nits to use for HDR10 (def: 200.0)
   -tonemap            Apply a tonemap operator based on maximum luminance
   -x2bias             Enable *2 - 1 conversion cases for unorm/pos-only-float

   <format>: R32G32B32A32_FLOAT R32G32B32A32_UINT R32G32B32A32_SINT
      R32G32B32_FLOAT R32G32B32_UINT R32G32B32_SINT R16G16B16A16_FLOAT
      R16G16B16A16_UNORM R16G16B16A16_UINT R16G16B16A16_SNORM
      R16G16B16A16_SINT R32G32_FLOAT R32G32_UINT R32G32_SINT
      R10G10B10A2_UNORM R10G10B10A2_UINT R11G11B10_FLOAT R8G8B8A8_UNORM
      R8G8B8A8_UNORM_SRGB R8G8B8A8_UINT R8G8B8A8_SNORM R8G8B8A8_SINT
      R16G16_FLOAT R16G16_UNORM R16G16_UINT R16G16_SNORM R16G16_SINT
      R32_FLOAT R32_UINT R32_SINT R8G8_UNORM R8G8_UINT R8G8_SNORM
      R8G8_SINT R16_FLOAT R16_UNORM R16_UINT R16_SNORM R16_SINT
      R8_UNORM R8_UINT R8_SNORM R8_SINT A8_UNORM R9G9B9E5_SHAREDEXP
      R8G8_B8G8_UNORM G8R8_G8B8_UNORM BC1_UNORM BC1_UNORM_SRGB BC2_UNORM
      BC2_UNORM_SRGB BC3_UNORM BC3_UNORM_SRGB BC4_UNORM BC4_SNORM
      BC5_UNORM BC5_SNORM B5G6R5_UNORM B5G5R5A1_UNORM B8G8R8A8_UNORM
      B8G8R8X8_UNORM R10G10B10_XR_BIAS_A2_UNORM B8G8R8A8_UNORM_SRGB
      B8G8R8X8_UNORM_SRGB BC6H_UF16 BC6H_SF16 BC7_UNORM BC7_UNORM_SRGB
      AYUV Y410 Y416 YUY2 Y210 Y216 B4G4R4A4_UNORM
      DXT1 DXT2 DXT3 DXT4 DXT5 RGBA BGRA FP16 FP32

   <filter>: POINT LINEAR CUBIC FANT BOX TRIANGLE POINT_DITHER
      LINEAR_DITHER CUBIC_DITHER FANT_DITHER BOX_DITHER TRIANGLE_DITHER
      POINT_DITHER_DIFFUSION LINEAR_DITHER_DIFFUSION CUBIC_DITHER_DIFFUSION
      FANT_DITHER_DIFFUSION BOX_DITHER_DIFFUSION TRIANGLE_DITHER_DIFFUSION

   <rot>: 709to2020 2020to709 709toHDR10 HDR10to709 P3to2020
      P3toHDR10

   <filetype>: BMP JPG JPEG PNG DDS TGA HDR TIF TIFF WDP HDP JXR

   <feature-level>: 9.1 9.2 9.3 10.0 10.1 11.0 11.1 12.0 12.1
```
