
interface pos {
    x:number
    y:number
}

interface ftimg {
    fimg:Image
    timg:Image
}

namespace images {

    export enum imgsizes { width, height}

    export function calculatePercentage(value: number, maxValue: number, maxPercentage: number, floated: boolean = false): number {
        if (value > maxValue) {
            console.error(`Value exceeds the maximum allowed. ${value} : ${maxValue}`);
            return maxPercentage;
        }
        value = Math.min(value, maxValue)
        let percentage = Math.floor((value / maxValue) * maxPercentage);
        if (floated) {
            percentage = (value / maxValue) * maxPercentage;
        }
        return Math.min(percentage, maxPercentage);
    }

    export function stampImg(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y);
    }

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

    //%blockid=img_posshadow
    //%block="x: $x y: $y"
    //%group="main shadow"
    //%inlineInputMode=inline
    //%weight=10
    export function _posnum(x:number,y:number) {
        let upoint:pos;
        upoint.x = x
        upoint.y = y
        return upoint
    }

    //%blockid=img_ftimgshadow
    //%block="stamp $f=screen_image_picker to $t=screen_image_picker"
    //%group="main shadow"
    //%inlineInputMode=inline
    //%weight=5
    export function _ftimg(f: Image, t: Image) {
        let uftimg: ftimg;
        uftimg.fimg = f
        uftimg.timg = t
        return uftimg
    }

    //%blockid=img_stampimage
    //%block="$duoimg at $point"
    //%duoimg.shadow="img_ftimgshadow"
    //%point.shadow="img_posshadow"
    //%group="image oparetor"
    //%inlineInputMode=inline
    //%weight=20
    export function stampImage(duoimg:ftimg, point:pos) {
        if (!duoimg.fimg || !duoimg.timg) { return; }
        duoimg.timg.drawTransparentImage(duoimg.fimg, point.x, point.y);
    }

    //%blockid=img_squareimage
    //%block="$uimg=screen_image_picker as square"
    //%group="image oparetor"
    //%inlineInputMode=inline
    //%weight=18
    export function squareImage(uimg:Image) {
        let imax = Math.max(uimg.width,uimg.height)
        let uuimg = image.create(imax,imax)
        stampImg(uimg, uuimg, Math.floor((imax / 2) - (uimg.width / 2)), Math.floor((imax / 2) - (uimg.height / 2)))
        uimg = uuimg.clone()
    }

    /**
     * calculated size
     * from image
     */
    //%blockid=img_imgsizes
    //%block="$img=screen_image_picker $imgsize"
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=60
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
    //%weight=40
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
    //%weight=20
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
    //%weight=10
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

    //%blockid=img_drawandcrop
    //%block="stamp $img0=screen_image_picker to $img1 and cutting color with $colorCut at x $xw y $yh"
    //%img1.shadow=variables_get
    //%colorCut.shadow="lists_create_with" colorCut.defl=colorindexpicker
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=50
    export function StampCut(img0:Image,img1:Image,colorCut:number[],xw:number,yh:number) {
        if (!img0 || !img1) return;
        for (let x = 0;x < img0.width;x++) {
            for (let y = 0;y < img0.height;y++) {
                const tcolor = img0.getPixel(x,y)
                const fcolor = img1.getPixel(xw+x,yh+y)
                if (tcolor > 0) {
                    if (colorCut.indexOf(fcolor) >= 0) {
                        img1.setPixel(xw+x,yh+y,fcolor)
                    }
                }
            }
        }
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

