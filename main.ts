enum imgsizes {
    width,
    height
}
namespace images {
    /**
     * calculated size
     * from image
     */
    //%blockid=img_imgsizes
    //%block="$img=screen_image_picker $imgsize"
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=20
    export function ImgSize(img: Image, imgsize: imgsizes) {
        switch (imgsize) {
            case imgsizes.width:
                return img.width;
            case imgsizes.height:
                return img.height;
            default:
                return 0;

        }
    }

    /**
     * advance image color replace
     * and get return image in another colors
     * from color input list
     */
    //%blockid=img_recol
    //%block="$img=screen_image_picker re stamp from $lacol to $lbcol"
    //%lacol.shadow="lists_create_with" lacol.defl="colorindexpicker"
    //%lbcol.shadow="lists_create_with" lbcol.defl="colorindexpicker"
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=30
    export function StampImg(img: Image, lacol: number[], lbcol: number[]) {
        let colnv = 0
        let coli = 0
        let ucol = 0
        let oimg = image.create(img.width, img.height)
        for (let imx = 0; imx < img.width; imx++) {
            for (let imy = 0; imy < img.height; imy++) {
                ucol = img.getPixel(imx, imy)
                coli = lacol.indexOf(ucol)
                if ( coli >= 0) { colnv = lacol[coli] } else { colnv = ucol}
                if (ucol >= 0) {
                    if (coli >= 0) {
                        oimg.setPixel(imx, imy, lbcol[coli])
                    } else {
                        oimg.setPixel(imx, imy, ucol)
                    }
                }
            }
        }
        return oimg
    }

    /**
     * advance image overalap
     * the another image
     * with scanning image
     * to check overlap
     */
    //%blockid=img_imgoverlap
    //%block="Image $ImgI=screen_image_picker overlaping OtherImage $ImgO=screen_image_picker At OffsetX $Ix OffsetY $Iy And DirX $Dx DirY $Dy"
    //%Dx.min=-1 Dx.max=1 Dx.defl=0
    //%Dy.min=-1 Dy.max=1 Dy.defl=0
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=40
    function ImgOverlapImg(ImgI: Image, ImgO: Image, Ix: number, Iy: number, Dx: number, Dy: number) {
        if (Dy == 0) {
            if (Dx > 0) {
                for (let Nx = 0; Nx < ImgI.width; Nx++) {
                    for (let Ny = 0; Ny < ImgI.height; Ny++) {
                        if (ImgI.getPixel(Nx, Ny) != 0 && ImgI.getPixel(Ix + Nx, Iy + Ny) != 0) {
                            return false
                        }
                    }
                }
            } else if (Dx < 0) {
                for (let Nx = ImgI.width; Nx >= 0; Nx--) {
                    for (let Ny = 0; Ny < ImgI.height; Ny++) {
                        if (ImgI.getPixel(Nx, Ny) != 0 && ImgI.getPixel(Ix + Nx, Iy + Ny) != 0) {
                            return false
                        }
                    }
                }
            }
        } else if (Dx == 0) {
            if (Dy > 0) {
                for (let Ny = 0; Ny < ImgI.height; Ny++) {
                    for (let Nx = 0; Nx < ImgI.width; Nx++) {
                        if (ImgI.getPixel(Nx, Ny) != 0 && ImgI.getPixel(Ix + Nx, Iy + Ny) != 0) {
                            return false
                        }
                    }
                }
            } else if (Dy < 0) {
                for (let Ny = ImgI.height; Ny >= 0; Ny--) {
                    for (let Nx = 0; Nx < ImgI.width; Nx++) {
                        if (ImgI.getPixel(Nx, Ny) != 0 && ImgI.getPixel(Ix + Nx, Iy + Ny) != 0) {
                            return false
                        }
                    }
                }
            }
        }
        return false
    }
}
