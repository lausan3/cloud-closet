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

interface PreviewFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview: string;
}

export default function Sidebar(){
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [activeButton, setActiveButton] = useState('menu');
  const [showPreview, setShowPreview] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);

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
      setShowPreview(false); // Close preview after upload
    }

    // Handle file added to show preview
    const fileAddedHandler = (file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviewFile: PreviewFile = {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: e.target?.result as string
        };
        
        setPreviewFiles(prev => [...prev, newPreviewFile]);
        setShowPreview(true);
      };
      reader.readAsDataURL(file.data);
    };

    // Handle file removed
    const fileRemovedHandler = (file: any) => {
      setPreviewFiles(prev => prev.filter(f => f.id !== file.id));
    };

    uppy.on("upload-success", successHandler);
    uppy.on("upload-error", errorHandler);
    uppy.on("complete", completeHandle);
    uppy.on("file-added", fileAddedHandler);
    uppy.on("file-removed", fileRemovedHandler);

    return () => {
      uppy.off("upload-success", successHandler);
      uppy.off("upload-error", errorHandler);
      uppy.off("complete", completeHandle);
      uppy.off("file-added", fileAddedHandler);
      uppy.off("file-removed", fileRemovedHandler);
    }
  }, [uppy]);

  const handleConfirmUpload = () => {
    uppy.upload();
  };

  const handleCancelUpload = () => {
    uppy.cancelAll();
    setPreviewFiles([]);
    setShowPreview(false);
  };

  const removeFile = (fileId: string) => {
    uppy.removeFile(fileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className={'flex ml-[5vw]'}>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#303030] rounded-lg p-6 max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Preview Files</h2>
              <button
                onClick={handleCancelUpload}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <ScrollArea className="h-96 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {previewFiles.map((file) => (
                  <div key={file.id} className="bg-[#212121] rounded-lg p-3 relative group">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    
                    <div className="aspect-square mb-2 rounded overflow-hidden bg-gray-700">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Add more files button - bottom left */}
            <button
              onClick={() => {
                // Trigger file browser
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.multiple = true;
                fileInput.accept = '.jpg,.png,.jpeg';
                fileInput.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    Array.from(files).forEach(file => {
                      uppy.addFile({
                        name: file.name,
                        type: file.type,
                        data: file,
                      });
                    });
                  }
                };
                fileInput.click();
              }}
              className="absolute bottom-6 left-6 w-12 h-12 bg-[#A9A9A9] hover:bg-[#8A8A8A] rounded-full flex items-center justify-center text-white text-2xl transition-colors"
            >
              +
            </button>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={previewFiles.length === 0}
              >
                Upload {previewFiles.length} file{previewFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* tab container - hidden when preview is active */}
      {!showPreview && (
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
      )}

      <ScrollArea className={'bg-[#303030] h-[100vh] w-[29vw] inline-block'}>
        <div className="flex justify-center">
          
          {/* Show CLOTHES if 'menu' button is active */}
          {activeButton === 'menu' && (
            <div key="cloth" className="w-[80%] pt-[2vw] pb-[3vw] text-[#A9A9AA]">
              <div className='w-[25%] h-[3vh] bg-gradient-to-b from-[#303030] to-transparent fixed top-0 '></div>
              {/* Hide Dashboard when preview is active */}
              {!showPreview && (
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
              )}
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