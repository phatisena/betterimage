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

    let DirT: number[][] = [
        [-1,-1],[0,-1],[1,-1],
        [-1,0],[0,0],[1,0],
        [-1,1],[0,1],[1,1]
    ]

    export enum DirIdx {
        //%block="left up"
        LU = 0,
        //%block="center up"
        CU = 1,
        //%block="right up"
        RU = 2,
        //%block="left center"
        LC = 3,
        //%block="center"
        CC = 4,
        //%block="right center"
        RC = 5,
        //%block="left down"
        LD = 6,
        //%block="center down"
        CD = 7,
        //%block="right down"
        RD = 8,
    }

    //%blockid=img_stampimage
    //%block="stamp $src=screen_image_picker to $to=screen_image_picker with dir $D at X: $x Y: $y"
    //%D.fieldEditor="gridpicker"
    //%D.fieldOptions.width=220
    //%D.fieldOptions.columns=3
    //%group="image oparetor"
    //%inlineInputMode=inline
    //%weight=10
    export function stampImage(src: Image, to: Image, D:DirIdx=4, x: number, y: number) {
        if (!src || !to) { return; }
        let dirl = DirT[D]
        let xi, yi = 0
        if (dirl[0] < 0) {
            xi = x
        } else if (dirl[0] == 0) {
            xi = (x - Math.floor(src.width / 2))
        } else if (dirl[0] > 0) {
            xi = (x - src.width)
        }
        if (dirl[1] < 0) {
            yi = (x - src.width)
        } else if (dirl[1] == 0) {
            yi = (x - Math.floor(src.width / 2))
        } else if (dirl[1] > 0) {
            yi = x
        }
        to.drawTransparentImage(src, xi, yi);
    }

    //%blockid=img_squareimage
    //%block="$uimg=screen_image_picker as square"
    //%group="image oparetor"
    //%inlineInputMode=inline
    //%weight=9
    export function squareImage(uimg:Image) {
        const imax = Math.max(uimg.width,uimg.height), uuimg = image.create(imax,imax)
        stampImage(uimg.clone(), uuimg,0, Math.floor((imax / 2) - (uimg.width / 2)), Math.floor((imax / 2) - (uimg.height / 2)))
        uimg = uuimg.clone()
        return uuimg
    }

    /**
     * calculated size
     * from image
     */
    //%blockid=img_imgsizes
    //%block="$img=screen_image_picker $imgsize"
    //%group="image oparetor"
    //%inlineInputMode=inline
    //%weight=8
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
    //%group="image manager"
    //%inlineInputMode=inline
    //%weight=10
    export function ReColor(img: Image, lacol: number[], lbcol: number[]) {
        let colnv = 0, oimg = image.create(img.width, img.height)
        for (let imx = 0; imx < img.width; imx++) {
            for (let imy = 0; imy < img.height; imy++) {
                const ucol = img.getPixel(imx, imy), coli = lacol.indexOf(ucol)
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
    //%mtl.min=0 mtl.max=12 mtl.defl=0
    //%group="image manager"
    //%inlineInputMode=inline
    //%weight=9
    export function ReColorShade(img: Image, mtl: number = 0, lacol: number[], lbcol: number[]) {
        let colnv2 = 0, oimg2 = image.create(img.width, img.height)
        let mt4l = mt4.length, mti = mtl % mt4l
        for (let imx2 = 0; imx2 < img.width; imx2++) {
            for (let imy2 = 0; imy2 < img.height; imy2++) {
                const rix = imx2 % mt4[mti].width, riy = imy2 % mt4[mti].height
                const ucol2 = img.getPixel(imx2, imy2), coli2 = lacol.indexOf(ucol2)
                if (coli2 >= 0) { colnv2 = lacol[coli2] } else { colnv2 = ucol2 }
                if (ucol2 >= 0) {
                    if (coli2 >= 0) {
                        if (mt4[mti].getPixel(rix, riy) > 0){
                            oimg2.setPixel(imx2, imy2, lbcol[coli2])
                        } else {
                            oimg2.setPixel(imx2, imy2, lacol[coli2])
                        }
                    } else {
                        if (mt4[mti].getPixel(rix, riy) > 0) {
                            oimg2.setPixel(imx2, imy2, ucol2)
                        }
                    }
                }
            }
        }
        return oimg2
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
    //%mtl.min=0 mtl.max=12 mtl.defl=0
    //%group="image manager"
    //%inlineInputMode=inline
    //%weight=8
    export function ReShade(img: Image, mtl: number = 0, icol: number = 0, ocol: number = 0) {
        let colnv3 = 0, coli3 = 0
        let oimg3 = image.create(img.width, img.height)
        let mt4l2 = mt4.length, mti2 = mtl % mt4l2
        for (let imx3 = 0; imx3 < img.width; imx3++) {
            for (let imy3 = 0; imy3 < img.height; imy3++) {
                const rix2 = imx3 % mt4[mti2].width, riy2 = imy3 % mt4[mti2].height, ucol3 = img.getPixel(imx3, imy3)
                if (icol > 0) {
                    if (icol == ucol3) {
                        if (mt4[mti2].getPixel(rix2, riy2) > 0) {
                            oimg3.setPixel(imx3, imy3, ocol)
                        } else {
                            oimg3.setPixel(imx3, imy3, ucol3)
                        }
                    }
                } else {
                    if (mt4[mti2].getPixel(rix2, riy2) > 0) {
                        oimg3.setPixel(imx3, imy3, ocol)
                    } else {
                        oimg3.setPixel(imx3, imy3, ucol3)
                    }
                }
            }
        }
        return oimg3
    }

    //%blockid=img_drawandcrop
    //%block="stamp $img0=screen_image_picker to $img1=screen_image_picker and cutting color with $colorCut at x $xw y $yh"
    //%colorCut.shadow="lists_create_with" colorCut.defl=colorindexpicker
    //%group="image manager"
    //%inlineInputMode=inline
    //%weight=7
    export function StampCutter(img0:Image,img1:Image,colorCut:number[],xw:number,yh:number) {
        if (!img0 || !img1) return undefined
        let img2 = image.create(img0.width,img0.height)
        for (let x = 0;x < img0.width;x++) {
            for (let y = 0;y < img0.height;y++) {
                const tcolor = img0.getPixel(x,y), fcolor = img1.getPixel(xw+x,yh+y)
                if (tcolor > 0) {
                    if (colorCut.indexOf(fcolor) >= 0) {
                        img2.setPixel(xw+x,yh+y,tcolor)
                    }
                }
            }
        }
        return img2
    }

    /**
     * advance image overalap
     * the another image
     * with scanning image
     * to checking overlap the image
     */
    //%blockid=img_imgoverlap
    //%block="image $ImgI=screen_image_picker overlap otherimage $ImgO=screen_image_picker At OffsetX $Ix OffsetY $Iy And DirX $Dx DirY $Dy"
    //%Dx.min=-1 Dx.max=1 Dx.defl=0
    //%Dy.min=-1 Dy.max=1 Dy.defl=0
    //%group="image overalap otherimage"
    //%inlineInputMode=inline
    //%weight=0
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
                for (let Nx2 = ImgI.width; Nx2 >= 0; Nx2--) {
                    for (let Ny2 = 0; Ny2 < ImgI.height; Ny2++) {
                        if (ImgI.getPixel(Nx2, Ny2) > 0 && ImgO.getPixel(Ix + Nx2, Iy + Ny2) > 0) {
                            return true
                        }
                    }
                }
            }
        } else if (Dx == 0 && Math.abs(Dy) > 0) {
            if (Dy > 0) {
                for (let Ny3 = 0; Ny3 < ImgI.height; Ny3++) {
                    for (let Nx3 = 0; Nx3 < ImgI.width; Nx3++) {
                        if (ImgI.getPixel(Nx3, Ny3) > 0 && ImgO.getPixel(Ix + Nx3, Iy + Ny3) > 0) {
                            return true
                        }
                    }
                }
            } else if (Dy < 0) {
                for (let Ny4 = ImgI.height; Ny4 >= 0; Ny4--) {
                    for (let Nx4 = 0; Nx4 < ImgI.width; Nx4++) {
                        if (ImgI.getPixel(Nx4, Ny4) > 0 && ImgO.getPixel(Ix + Nx4, Iy + Ny4) > 0) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
    
}
