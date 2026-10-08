# Third-party assets

Surface textures from [Poly Haven](https://polyhaven.com), all **CC0** (public
domain). Credit is not required by the licence; it is here because taking work
without naming it is a bad habit even when it is legal.

| File | Source asset | Maps used |
|---|---|---|
| `tex/walnut_diff_2k.webp`, `tex/walnut_nor_gl_2k.webp`, `tex/walnut_rough_1k.webp` | [american_walnut_veneer](https://polyhaven.com/a/american_walnut_veneer) | diffuse, OpenGL normal, roughness |
| `tex/plaster_nor_gl_1k.webp`, `tex/plaster_rough_512.webp` | [grey_plaster_02](https://polyhaven.com/a/grey_plaster_02) | OpenGL normal, roughness |
| `tex/linen_nor_gl_1k.webp`, `tex/linen_rough_512.webp` | [rough_linen](https://polyhaven.com/a/rough_linen) | OpenGL normal, roughness |

Downloaded as 2K/1K JPEG and re-encoded to WebP. Normal maps are kept at
quality 90 because at 80 the grain bands, and a banded normal map reads as
faceting on a surface that should be smooth. Roughness maps carry no structure
that survives the normal map's shading, so they are the ones that get shrunk.

The plaster and linen diffuse maps are deliberately **not** shipped: both
surfaces take their colour from the locked palette, so a downloaded albedo
would only fight it.
