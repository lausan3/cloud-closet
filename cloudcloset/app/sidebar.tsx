import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function Sidebar(){
    return (
        <div className={'flex ml-[5vw]'}>
            {/* tab container */}
            <div className={'rounded-tl-[1vw] rounded-bl-[1vw] bg-[#A9A9A9] w-[2.5vw] h-[10vw] inline-block mt-[5vw]'}>
                {/* menu button */}
                <div className={'bg-[#303030] w-[100%] h-[25%] mb-[1vw] mt-[85%]'}>
                    <button className="w-[100%] flex justify-center items-center cursor-pointer">
                        <img className={'w-[1vw] h-[1vw] mt-[28%]'} src="/menu.png" alt="menu" />
                    </button>
                </div>
                {/* saved button */}
                <div className="w-[100%] h-[25%]">
                    <button className="w-[100%] flex justify-center items-center cursor-pointer">
                        <img className={'w-[1vw] h-[1vw] mt-[28%]'}  src="/save.png" alt="menu" />
                    </button>
                </div>
            </div>
            <ScrollArea className={'bg-[#303030] h-[100vh] w-[29vw] inline-block'}>
                <div className="flex justify-center">
                    <div className="w-[85%] pt-[3vw] pb-[3vw] text-[#A9A9A9]">
                    {clothes.map((item)=> (
                           <div key={item.id}>
                                <img 
                                    className="inline-block w-[10%] aspect-square object-cover rounded-[.5vw]" 
                                    src={item.src} 
                                />
                                 <p className="inline-block">
                                  {item.tags.map((tag)=>(
                                      <span key={`${item.id}-${tag}`} >
                                              {item.tags.join(', ')}
                                        </span>
                                 ))}
                             </p>
                        </div>
                    ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

const clothes = [
  {
    id: 1,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['red', 'cropped', 'top', 'casual', 'summer']
  },
  {
    id: 2,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['blue', 'denim', 'jeans', 'bottoms', 'straight-leg']
  },
  {
    id: 3,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['black', 'leather', 'jacket', 'outerwear', 'biker']
  },
  {
    id: 4,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['white', 'dress', 'summer', 'casual', 'midi']
  },
  {
    id: 5,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['gray', 'hoodie', 'top', 'loungewear', 'oversized', 'cotton']
  },
  {
    id: 6,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['beige', 'trench', 'coat', 'outerwear', 'formal', 'classic']
  },
  {
    id: 7,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['green', 'cargo', 'pants', 'bottoms', 'utility', 'casual']
  },
  {
    id: 8,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['plaid', 'skirt', 'bottoms', 'mini', 'preppy']
  },
  {
    id: 9,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['black', 'graphic', 'tee', 'top', 'oversized', 'casual']
  },
  {
    id: 10,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['navy', 'blazer', 'outerwear', 'formal', 'workwear']
  },
  {
    id: 11,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['pink', 'silk', 'slip', 'dress', 'eveningwear']
  },
  {
    id: 12,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['denim', 'shorts', 'bottoms', 'high-waisted', 'summer']
  },
  {
    id: 13,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['cream', 'knit', 'sweater', 'top', 'chunky', 'winter']
  },
  {
    id: 14,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['floral', 'maxi', 'dress', 'summer', 'boho']
  },
  {
    id: 15,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['white', 'sneakers', 'shoes', 'accessory', 'casual']
  },
  {
    id: 16,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['black', 'boots', 'shoes', 'accessory', 'leather', 'combat']
  },
  {
    id: 17,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['gold', 'necklace', 'accessory', 'jewelry']
  },
  {
    id: 18,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['brown', 'crossbody', 'bag', 'accessory', 'leather']
  },
  {
    id: 19,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['black', 'wool', 'beanie', 'accessory', 'winter', 'hat']
  },
  {
    id: 20,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['gray', 'athletic', 'leggings', 'bottoms', 'sportswear']
  }
];