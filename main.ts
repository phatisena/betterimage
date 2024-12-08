
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

    export function stampImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y);
    }

    export function createRenderable(index: number, handler: (screen: Image) => void) {
        scene.createRenderable(index, handler);
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
    //%block="stamp $img0=screen_image_picker to $img1 in color cut $colorCut at x $xw y $yh"
    //%img1.shadow=variables_get img1.defl=picture
    //%colorCut.shadow="lists_create_with" colorCut.defl=colorindexpicker
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=50
    export function StampCut(img0:Image,img1:Image,colorCut:number[],xw:number,yh:number) {
        let stammed:number[][] = []
        let todopos:number[][] = []
        let cenpos:number[] = [Math.floor(img0.width / 2),Math.floor(img0.height / 2)]
        let dirpin:number[][] = [[1,0,-1,0],[0,1,0,-1]]
        let nextpos:number[] = [cenpos[0],cenpos[1]]
        let curpos:number[] = [nextpos[0],nextpos[1]]
        if (colorCut.indexOf(img1.getPixel(xw + cenpos[0],yh + cenpos[1])) >= 0) { return img1 }
        img1.setPixel(xw + nextpos[0],yh + nextpos[1],img0.getPixel(nextpos[0],nextpos[1]))
        todopos.push([nextpos[0],nextpos[1]])
        stammed.push([nextpos[0],nextpos[1]])
        while (todopos.length > 0) {
            curpos = [todopos[0][0],todopos[0][1]]
            todopos.removeAt(0)
            for (let diri = 0;diri < dirpin.length; diri++) {
                nextpos = [curpos[0] + dirpin[0][diri],curpos[1] + dirpin[1][diri]]
                if (colorCut.indexOf(img1.getPixel(xw + nextpos[0],yh + nextpos[1])) < 0 && stammed.indexOf([nextpos[0],nextpos[1]]) < 0) {
                    img1.setPixel(xw + nextpos[0],yh + nextpos[1],img0.getPixel(nextpos[0],nextpos[1]))
                    todopos.push([nextpos[0],nextpos[1]])
                    stammed.push([nextpos[0],nextpos[1]])
                }
            }
        }
        return img1.clone()
    }
    /**
     * fill matrix shader
     * render from color
     */
    //%blockid=img_matrixshader
    //%block="get $Uimg=screen_image_picker to render matrix shader from $lCol"
    //%lCol.shadow="lists_create_with" lCol.defl="colorindexpicker"
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=5
    //%blockHidden=true
    export function MatrixShade (Uimg: Image, lCol: number[]) {
        let DotC = 0; let SumDot = 0; let DotIdx = 0; let remM = 0; let remx = 0; let remy = 0
        let Iimg = image.create(Uimg.width,Uimg.height)
        let SumCol = calculatePercentage(lCol.length,16,15,true)
        let SumMt4 = calculatePercentage(SumCol,mt4.length,mt4.length-1,true)
        for (let hy = 0; hy < Uimg.height; hy++) {
            for (let wx = 0; wx < Uimg.width; wx++) {
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
     * advance image color replace
     * and get return image in another colors
     * from color input list
     */
    //%blockid=img_matrixrender
    //%block="render matrix shader? $Render in z-index $Uidx from $lCol"
    //%lCol.shadow="lists_create_with" lCol.defl="colorindexpicker"
    //%group="better image"
    //%inlineInputMode=inline
    //%weight=30
    //%blockHidden=true
    export function MatrixScreen(Render: boolean = false ,Uidx:number = 0, lCol: number[] = []) {
        let Iimg = image.create(scene.screenWidth(), scene.screenHeight())
        let Sidx = 999999999
        if (Uidx > 0) {Sidx = Uidx }
        createRenderable(Sidx, function(srcimg) {
            if (Render) {
            Iimg.fill(scene.backgroundColor())
            stampImage(Iimg,image.screenImage(),0,0)
            stampImage(MatrixShade(Iimg,lCol),srcimg,0,0)
            }
        })
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
