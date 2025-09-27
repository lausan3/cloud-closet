"use client"
import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import ImageEditor from '@uppy/image-editor';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';
import '@uppy/image-editor/css/style.min.css';



export default function Sidebar(){
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [activeButton, setActiveButton] = useState('menu');

  const [uppy] = useState(()=> {
    const uppyInstance = new Uppy({
      id: "file-uploader",
      restrictions:{
        maxNumberOfFiles: 10,
        allowedFileTypes: [".jpg", ".png", ".jpeg"]
      },
      autoProceed: false,
    });


    uppyInstance.use(XHRUpload, {
      endpoint: "PLACEHOLDER",
      fieldName: "files"
    })

    return uppyInstance;
  })

  useEffect(()=>{
    const successHandler = (file:any, response: any) => {
      console.log("File uploaded successfully: ", file.name);
      console.log("Server response: ", response);
    };

    const errorHandler = (file:any, error:any) => {
      console.error("Error uploading files:", file.name);
      console.error("Error details: ", error);
    }

    const completeHandle = (result:any) => {
      console.log("Upload complete! Files: ", result.successful);
    }

    uppy.on("upload-success", successHandler);
    uppy.on("upload-error", errorHandler);
    uppy.on("complete", completeHandle);
      return () => {
        uppy.off("upload-success", successHandler);
        uppy.off("upload-error", errorHandler);
        uppy.off("complete", completeHandle);
      }

  }, [uppy]);
  
  return (
    <div className={'flex ml-[5vw]'}>
      {/* tab container */}
      <div className={'rounded-tl-[1vw] rounded-bl-[1vw] bg-[#A9A9A9] w-[2.5vw] h-[10vw] inline-block mt-[5vw]'}>
        
        {/* menu button */}
        <div 
          className={`w-[100%] h-[25%] mb-[1vw] mt-[85%] ${activeButton === 'menu' ? 'bg-[#303030]' : 'bg-[#A9A9A9]'}`}
        >
          <button 
            onClick={() => setActiveButton('menu')} 
            className="w-full h-full flex justify-center items-center cursor-pointer"
          >
            <img 
              className={'w-[1vw] h-[1vw]'} 
              src={activeButton === 'menu' ? "/menu-active.png" : "/menu.png"}
              alt="menu" 
            />
          </button>
        </div>
        
        {/* saved button */}
        <div 
          className={`w-[100%] h-[25%] ${activeButton === 'saved' ? 'bg-[#303030]' : 'bg-[#A9A9A9]'}`}
        >
          <button 
            onClick={() => setActiveButton('saved')} 
            className="w-full h-full flex justify-center items-center cursor-pointer"
          >
            <img 
              className={'w-[1vw] h-[1vw]'} 
              src={activeButton === 'saved' ? "/save-active.png" : "/save.png"}
              alt="saved" 
            />
          </button>
        </div>
      </div>

      <ScrollArea className={'bg-[#303030] h-[100vh] w-[29vw] inline-block'}>
        <div className="flex justify-center">
          
          {/* Show CLOTHES if 'menu' button is active */}
          {activeButton === 'menu' && (
            <div key="cloth" className="w-[80%] pt-[2vw] pb-[3vw] text-[#A9A9AA]">
              <div className='w-[25%] h-[27%] bg-gradient-to-b from-[#303030] to-transparent fixed top-0 '></div>
              <div>
                <Dashboard
                  uppy={uppy}
                  height={450}
                  note="Accepted file types: jpg, png, jpeg"
                  proudlyDisplayPoweredByUppy={false}
                  showLinkToFileUploadResult={false}
                  showRemoveButtonAfterComplete={false}

                />
              </div>
              {clothes.map((item) => {
                const isExpanded = item.id === expandedItemId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setExpandedItemId(prevId => (prevId === item.id ? null : item.id))}
                    className={`group mb-[.5vw] flex items-start p-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-100 ease-in hover:bg-[#212121] ${isExpanded ? 'max-h-96 bg-[#212121] shadow-lg w-[100%]' : 'max-h-[2.5vw] w-[100%]'}`}
                  >
                    <div className="mr-[1vw] flex-shrink-0">
                      <img
                        className="w-[2vw] inline-block aspect-square object-cover rounded-[.5vw]"
                        src={item.src}
                        alt={item.tags[0] || 'Clothing item'}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[.7vw] leading-tight ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {item.tags.join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show OUTFITS if 'saved' button is active */}
          {activeButton === 'saved' && (
            <div key="outfits" className="w-[80%] pt-[4vw] pb-[3vw] text-[#A9A9AA]">
              {/* You can build your outfits list here */}
              <h1>Outfits will be displayed here.</h1>
            </div>
          )}
          
        </div>
      </ScrollArea>
    </div>
  )
}

const clothes = [
  {
    id: 1,
    src: 'https://i5.walmartimages.com/seo/Autumn-Fashion-Brand-Men-Clothes-Slim-Fit-Men-Long-Sleeve-Shirt-Men-Plaid-Cotton-Casual-Men-Shirt-Social-Plus-Size-M-XXL_8fb36068-a784-469c-9019-fcc0540e148c_1.6699db046d8de098a7b8a6fe5eaa10b6.jpeg',
    tags: ['red', 'cropped', 'top', 'casual', 'summer, Vibrant, mysterious, serene, chaotic, jubilant, melancholy, whimsical, austere, opulent, ephemeral, resilient, luminous, garrulous, taciturn, meticulous, intrepid, pensive, exuberant, ethereal, pragmatic, quixotic, sanguine, stoic, volatile, zealous', 'red', 'cropped', 'top', 'casual', 'summer, Vibrant, mysterious, serene, chaotic, jubilant, melancholy, whimsical, austere, opulent, ephemeral, resilient, luminous, garrulous, taciturn, meticulous, intrepid, pensive, exuberant, ethereal, pragmatic, quixotic, sanguine, stoic, volatile, zealous']
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