namespace images {
    /**
     * calculated width
     * from image width
     */
    //%blockid=img_imgwidth
    //%block="$img=screen_image_picker width"
    //%img.shadow=variable_get
    //%group="better image"
    //%inlineInputMode=inline
    export function ImgWidth(img: Image) {
        return img.width
    }

    /**
     * calculated height
     * from image height
     */
    //%blockid=img_imgheight
    //%block="$img=screen_image_picker height"
    //%img.shadow=variable_get
    //%group="better image"
    //%inlineInputMode=inline
    export function ImgHeight(img: Image) {
        return img.height
    }

    /**
     * advance image color replace
     * and get return image in another colors
     * from color input list
     */
    //%blockid=img_recol
    //%block="$img=screen_image_picker re stamp from $lacol to $lbcol"
    //%lacol.shadow=colorindexpicker
    //%lbcol.shadow=colorindexpicker
    //%group="better image"
    //%inlineInputMode=inline
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
                if (ucol > 0) {
                    if (coli >= 0) {
                        oimg.setPixel(imx, imy, lbcol[coli])
                    }
                }
            }
        }
        return oimg
    }
}
