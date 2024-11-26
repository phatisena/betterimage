
namespace images {

    export enum imgsizes { width, height}

    let mt4: Image[] = [img`
        . . . .
        . . . .
        . . . .
        . . . .
    `,
    img`
        . . . .
        . . . .
        . . f .
        . . . .
    `,
    img`
        f . . .
        . . . .
        . . f .
        . . . .
    `,
        img`
            f . f .
            . . . .
            f . f .
            . . . .
        `,
        img`
            f . f .
            . f . .
            f . f .
            . . . .
        `,
        img`
            f . f .
            . f . .
            f . f .
            . . . f
        `,
        img`
            f . f .
            . f . f
            f . f .
            . f . f
        `,
        img`
            f . f .
            f f . f
            f . f .
            f f f f
        `,

        img`
            f . f .
            f f . f
            f . f .
            . f f f
        `,
        img`
            f . f .
            f f f f
            f . f .
            f f f f
        `,
        img`
            f f f .
            f f f f
            f . f f
            f f f f
        `,
        img`
            f f f f
            f f f f
            f . f f
            f f f f
        `,
        img`
            f f f f
            f f f f
            f f f f
            f f f f
        `]

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
    export function ReColor(img: Image, lacol: number[], lbcol: number[]) {
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
     * advance image color replace
     * and get return image
     * in another colors
     * as matrix shader
     * from color input list
     */
    //%blockid=img_recolshade
    //%block="$img=screen_image_picker matrix shader $mtl from $lacol to $lbcol"
    //%lacol.shadow="lists_create_with" lacol.defl="colorindexpicker"
    //%lbcol.shadow="lists_create_with" lbcol.defl="colorindexpicker"
    //%mtl.min=0 mtl.max=8 mtl.defl=0
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=30
    export function ReColShade(img: Image, mtl: number = 0, lacol: number[], lbcol: number[]) {
        let colnv = 0
        let coli = 0
        let ucol = 0
        let oimg = image.create(img.width, img.height)
        let rix = 0
        let riy = 0
        let mt4l = mt4.length
        let mti = mtl % mt4l
        for (let imx = 0; imx < img.width; imx++) {
            for (let imy = 0; imy < img.height; imy++) {
                rix = imx % mt4[mti].width
                riy = imy % mt4[mti].height
                ucol = img.getPixel(imx, imy)
                coli = lacol.indexOf(ucol)
                if (coli >= 0) { colnv = lacol[coli] } else { colnv = ucol }
                if (ucol >= 0) {
                    if (coli >= 0) {
                        if (mt4[mti].getPixel(rix, riy) > 0){
                            oimg.setPixel(imx, imy, lbcol[coli])
                        } else {
                            oimg.setPixel(imx, imy, lacol[coli])
                        }
                    } else {
                        if (mt4[mti].getPixel(rix, riy) > 0) {
                            oimg.setPixel(imx, imy, ucol)
                        }
                    }
                }
            }
        }
        return oimg
    }

    /**
     * advance image color
     * fill matrix shader
     * to image
     */
    //%blockid=img_reshade
    //%block="$img=screen_image_picker fill matrix shader $mtl from $icol to $ocol"
    //%icol.shadow="colorindexpicker"
    //%ocol.shadow="colorindexpicker"
    //%mtl.min=0 mtl.max=8 mtl.defl=0
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=30
    export function ReShade(img: Image, mtl: number = 0, icol: number = 0, ocol: number = 0) {
        let colnv = 0
        let coli = 0
        let ucol = 0
        let oimg = image.create(img.width, img.height)
        let rix = 0
        let riy = 0
        let mt4l = mt4.length
        let mti = mtl % mt4l
        for (let imx = 0; imx < img.width; imx++) {
            for (let imy = 0; imy < img.height; imy++) {
                rix = imx % mt4[mti].width
                riy = imy % mt4[mti].height
                ucol = img.getPixel(imx, imy)
                if (icol > 0) {
                    if (icol == ucol) {
                        if (mt4[mti].getPixel(rix, riy) > 0) {
                            oimg.setPixel(imx, imy, ocol)
                        } else {
                            oimg.setPixel(imx, imy, ucol)
                        }
                    }
                } else {
                    if (mt4[mti].getPixel(rix, riy) > 0) {
                        oimg.setPixel(imx, imy, ocol)
                    } else {
                        oimg.setPixel(imx, imy, ucol)
                    }
                }
            }
        }
        return oimg
    }

    /**
     * fill matrix shader
     * render from color
     */
    //%blockid=img_matrixshader
    //%block="get $img=screen_image_picker to render matrix shader from $lCol"
    //%lCol.shadow="lists_create_with" lCol.defl="colorindexpicker"
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=30
export function MatrixShade (Uimg: Image, lCol: number[]) {
    let DotC = 0; let SumDot = 0; let DotIdx = 0; let remM = 0; let remX = 0; let remY = 0
    let Iimg = image.create(images.ImgSize(Uimg, images.imgsizes.width), images.ImgSize(Uimg, images.imgsizes.height))
    let SumCol = Math.floor(15 / Math.max(lCol.length - 1, 1))
    let SumMt4 = Math.abs(Math.round(SumCol / mt4.length))
    for (let hy = 0; hy < Iimg.height; hy++) {
        for (let wx = 0; wx < Img.width; wx++) {
            DotC = Uimg.getPixel(wx, hy)
            SumDot = Math.floor(DotC / SumCol)
            DotIdx = DotC % SumCol * SumMt4
            remM = DotIdx % mt4.length
            remx = wx % mt4[remM].width
            remy = hy % mt4[remM].height
            Iimg.setPixel(wx, hy, lCol[SumDot])
            if (mt4[remM].getPixel(remx, remy) > 0) {
                Iimg.setPixel(wx, hy, lCol[Math.min(SumDot + 1, lCol.length - 1)])
            }
        }
    }
    return Iimg
}
    
    /**
     * advance image overalap
     * the another image
     * with scanning image
     * to checking overlap the image
     */
    //%blockid=img_imgoverlap
    //%block="Image $ImgI=screen_image_picker overlaping OtherImage $ImgO=screen_image_picker At OffsetX $Ix OffsetY $Iy And DirX $Dx DirY $Dy"
    //%Dx.min=-1 Dx.max=1 Dx.defl=0
    //%Dy.min=-1 Dy.max=1 Dy.defl=0
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=40
    export function ImgOverlapImg(ImgI: Image, ImgO: Image, Ix: number, Iy: number, Dx: number, Dy: number) {
        if (ImgI.width > ImgO.height || ImgI.width > ImgO.height) { return false }
        if (Dy == 0 && Math.abs(Dx) > 0) {
            if (Dx > 0) {
                for (let Nx = 0; Nx < ImgI.width; Nx++) {
                    for (let Ny = 0; Ny < ImgI.height; Ny++) {
                        if (ImgI.getPixel(Nx, Ny) > 0 && ImgO.getPixel(Ix + Nx, Iy + Ny) > 0) {
                            return true
                        }
                    }
                }
            } else if (Dx < 0) {
                for (let Nx = ImgI.width; Nx >= 0; Nx--) {
                    for (let Ny = 0; Ny < ImgI.height; Ny++) {
                        if (ImgI.getPixel(Nx, Ny) > 0 && ImgO.getPixel(Ix + Nx, Iy + Ny) > 0) {
                            return true
                        }
                    }
                }
            }
        } else if (Dx == 0 && Math.abs(Dy) > 0) {
            if (Dy > 0) {
                for (let Ny = 0; Ny < ImgI.height; Ny++) {
                    for (let Nx = 0; Nx < ImgI.width; Nx++) {
                        if (ImgI.getPixel(Nx, Ny) > 0 && ImgO.getPixel(Ix + Nx, Iy + Ny) > 0) {
                            return true
                        }
                    }
                }
            } else if (Dy < 0) {
                for (let Ny = ImgI.height; Ny >= 0; Ny--) {
                    for (let Nx = 0; Nx < ImgI.width; Nx++) {
                        if (ImgI.getPixel(Nx, Ny) > 0 && ImgO.getPixel(Ix + Nx, Iy + Ny) > 0) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
    
}
