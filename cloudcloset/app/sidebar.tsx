"use client"
import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';
import '@uppy/image-editor/css/style.min.css';
import { useAuth } from '@clerk/nextjs';

interface PreviewFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview: string;
}

export default function Sidebar() {
  const { userId } = useAuth();
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState('menu');
  const [showPreview, setShowPreview] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  
  // REMOVED: The 'clothess' state variable is no longer needed.
  
  const [visibleItems, setVisibleItems] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      id: "file-uploader",
      restrictions: { maxNumberOfFiles: 15, allowedFileTypes: [".jpg", ".png", ".jpeg"] },
      autoProceed: false,
    });
    uppyInstance.use(XHRUpload, {
      endpoint: `http://${process.env.NEXT_PUBLIC_API_URL}/images`,
      fieldName: "files",
      formData: true,
    });
    return uppyInstance;
  });

  // REMOVED: All 'fetchClothes' logic has been removed as it's not used with a static array.

  useEffect(() => {
    const fileAddedHandler = (file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewFiles(prev => [...prev, {
          id: file.id, name: file.name, size: file.size, type: file.type,
          preview: e.target?.result as string,
        }]);
        setShowPreview(true);
      };
      reader.readAsDataURL(file.data);
      uppy.setFileMeta(file.id, { userId: userId });
    };

    const fileRemovedHandler = (file: any) => setPreviewFiles(prev => prev.filter(f => f.id !== file.id));
    
    const successHandler = (file: any, response: any) => {
      const url = response.uploadURL;
      if (url) {
        fetch(url, { method: "PUT", headers: { "Content-Type": file.type }, body: file.data })
          .then(res => { if (!res.ok) throw new Error("Failed to upload to S3"); });
      }
    };
    
    const errorHandler = (file: any, error: any) => console.error("Error uploading files:", file.name, error);
    
    const completeHandler = (result: any) => {
      console.log("Upload complete! Files:", result.successful);
      setShowPreview(false);
      setPreviewFiles([]);
      // Note: The list will not update here because it's static.
    };

    uppy.on("file-added", fileAddedHandler);
    uppy.on("file-removed", fileRemovedHandler);
    uppy.on("upload-success", successHandler);
    uppy.on("upload-error", errorHandler);
    uppy.on("complete", completeHandler);

    return () => {
      uppy.off("file-added", fileAddedHandler);
      uppy.off("file-removed", fileRemovedHandler);
      uppy.off("upload-success", successHandler);
      uppy.off("upload-error", errorHandler);
      uppy.off("complete", completeHandler);
    };
  }, [uppy, userId]);

  // MODIFIED: Animation now depends on the static 'clothes.length'.
  useEffect(() => {
    if (animationTrigger === 0) return;
    const interval = setInterval(() => {
      setVisibleItems(prevCount => {
        if (prevCount >= clothes.length) {
          clearInterval(interval);
          return prevCount;
        }
        return prevCount + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [animationTrigger]); // Dependency on clothes.length is removed as it's a constant.

  const handleConfirmUpload = () => {
    uppy.upload();
    setVisibleItems(0);
    setAnimationTrigger(c => c + 1);
  };

  const handleCancelUpload = () => { uppy.cancelAll(); setPreviewFiles([]); setShowPreview(false); };
  const removeFile = (fileId: string) => uppy.removeFile(fileId);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex ml-[5vw]">
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* ... Preview Modal JSX is unchanged ... */}
            <div className="bg-[#303030] rounded-lg p-6 max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#A9A9A9]">Preview Files</h2>
              <button onClick={handleCancelUpload} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <ScrollArea className="h-96 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {previewFiles.map(file => (
                  <div key={file.id} className="bg-[#212121] rounded-lg p-3 relative group">
                    <button onClick={() => removeFile(file.id)} className="absolute top-2 right-2 bg-red-500 text-[#A9A9A9] rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    <div className="aspect-square mb-2 rounded overflow-hidden bg-gray-700">
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm text-gray-300">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <button onClick={() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file"; fileInput.multiple = true; fileInput.accept = ".jpg,.png,.jpeg";
              fileInput.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) Array.from(files).forEach(file => uppy.addFile({ name: file.name, type: file.type, data: file }));
              };
              fileInput.click();
            }} className="absolute bottom-6 left-6 w-12 h-12 bg-[#A9A9A9] hover:bg-[#8A8A8A] rounded-full flex items-center justify-center text-white text-2xl transition-colors">+</button>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleCancelUpload} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">Cancel</button>
              <button id="UPLOADBTN" onClick={handleConfirmUpload} className="px-4 py-2 bg-[#212121] text-white rounded hover:bg-blue-700 transition-colors" disabled={previewFiles.length === 0}>
                Upload {previewFiles.length} file{previewFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
      <ScrollArea className="bg-[#303030] h-[100vh] w-[29vw] inline-block">
        <div className="flex justify-center">
          {activeButton === 'menu' && (
            <div className="w-[80%] pt-[2vw] pb-[3vw] text-[#A9A9AA]">
              <div className="w-[25%] h-[8vh] bg-gradient-to-b from-[#303030] to-transparent fixed top-0"></div>
              {!showPreview && (<Dashboard uppy={uppy} height={450} note="Accepted file types: jpg, png, jpeg" proudlyDisplayPoweredByUppy={false} showLinkToFileResult={false} showRemoveButtonAfterComplete={false} />)}
              
              {/* MODIFIED: Now mapping over the static 'clothes' array */}
              {clothes.map((item, index) => {
                const isExpanded = item.id === expandedItemId;
                const isVisible = index < visibleItems;
                return (
                  <div
                    id='clothing_divs'
                    key={item.id}
                    onClick={() => setExpandedItemId(prev => prev === item.id ? null : item.id)}
                    className={`group mb-[.5vw] flex items-start p-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#212121] ${isExpanded ? 'max-h-96 bg-[#212121] shadow-lg w-[100%]' : 'max-h-[2.5vw] w-[100%]'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="relative w-[2vw] aspect-square">
                      <img id="clothes-icon" className="mr-13 w-full h-full object-cover rounded-[.5vw] transition-colors duration-200 group-hover:filter group-hover:brightness-0 group-hover:invert" src={item.src} alt={item.tags[0] || 'Clothing item'} />
                      <span className="text-xxxl rounded-[.5vw] bg-[#A9A9AA] absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 text-lg cursor-pointer">×</span>
                    </div>
                    <div className="min-w-0">
                      <p className={`ml-3.5 text-[.7vw] leading-tight ${isExpanded ? '' : 'line-clamp-2'}`}>{item.tags.join(', ')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Your static 'clothes' array remains here at the bottom of the file
const clothes = [
{
    id: 1,
    src: 'https://img.sonofatailor.com/images/customizer/product/extra-heavy-cotton/ss/Black.jpg',
    tags: [
        'black', 'plain', 'simple', 'casual', 'versatile', 'classic', 'minimalist', 'monochromatic', 'essential', 'short-sleeved', 'unadorned', 'solid-color',
        'a foundational wardrobe staple for virtually any casual or layered outfit',
        'deep jet-black hue that resists fading and provides a sleek, modern aesthetic',
        'expertly crafted from premium, soft-spun cotton for superior comfort and breathability all day long',
        'an endlessly adaptable piece that pairs effortlessly with everything from rugged jeans to tailored chinos',
        'the ultimate testament to the power of understated elegance and less-is-more fashion philosophy',
        'designed with a classic crew neck and a tailored fit that is neither too tight nor too loose',
        'perfect for wearing on its own during warmer months or as a base layer under a jacket or flannel in the cold'
    ]
},
    { id: 2, src: 'https://assets-prd.cintas.com/sf-assets/images/default-source/solutions-images/uniforms-apparel/rental-uniforms/work-shirts/blue-carhartt-rugged-flex-work-shirt.jpg?sfvrsn=6c68f5cb_3', tags: ["blue", "long-sleeved", "button-down", "collared", "work-shirt", "casual", "rugged", "two-pocket"] },
    { id: 3, src: 'https://static.contrado.com/resources/images/2021-6/181024/printed-childrens-t-shirts-1214583_l.jpg', tags: ['colorful', 'kids t-shirt', 'abstract', 'vibrant all-over graphic print', 'short-sleeved', 'artistic paint splatter design', 'playful multi-colored casual wear'] },
    { id: 4, src: 'https://m.media-amazon.com/images/I/51InVIt3OIL._UY1000_.jpg', tags: ['black', 'leather', 'biker jacket', 'edgy', 'classic motorcycle style with asymmetrical zip', 'rugged', 'mens fashion outerwear', 'timeless and versatile piece with zippered cuffs and pockets'] },
    { id: 5, src: 'https://m.media-amazon.com/images/I/719YUF6kD6L._UY1000_.jpg', tags: ['tan', 'khaki', 'cargo pants', 'casual', 'utilitarian multi-pocket trousers', 'rugged', 'mens workwear and outdoor apparel', 'durable and functional pants with ample storage'] },
    { id: 6, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUsNHOtU9K1wSCT0YqqSKN86IBgqvAwOnsg&s', tags: ['parachute', 'womens casual wear', 'pants', 'loose', 'orange', 'elastic', 'casual','colorful'] },
    { id: 7, src: 'https://i.pinimg.com/236x/5f/26/29/5f2629317872dc57c76437bc20ab77b2.jpg', tags: ['blue jeans', 'denim', 'light wash', 'baggy fit', 'relaxed fit', 'wide-leg jeans', 'utilitarian style', 'streetwear', 'casual', 'patch detail', 'high-waisted', 'womens fashion', 'carpenter jeans'] },
    { id: 8, src: 'https://m.media-amazon.com/images/I/61HknRN0TcL._UY1000_.jpg', tags: ['black','red undershirt', 'denim jacket', 'casual', 'jean jacket', 'classic button-front outerwear', 'timeless', 'versatile womens jacket with flap chest pockets', 'an iconic wardrobe staple'] },
    { id: 9, src: 'https://franklinandpoe.com/cdn/shop/products/SSM_7912_2000x3001.jpg?v=1665591043', tags: ['brown leather', 'shearling jacket', 'aviator jacket', 'bomber jacket', 'mens fashion', 'outerwear', 'winter coat', 'sheepskin collar', 'classic', 'vintage style', 'rugged', 'warm', 'zippered front'] },
    { id: 10, src: 'https://cdn11.bigcommerce.com/s-lulfv0vz2b/images/stencil/960w/products/12761/142070/all-season-jacket__dark-olive_33__54745.1757780497.jpg?c=1', tags: ['dark olive', 'green', 'jacket', 'outdoors', 'all-season outerwear', 'functional', 'versatile and durable coat for various weather conditions', 'zippered utility jacket'] },
{
    id: 11,
    src: 'https://cdn.imgbin.com/24/13/1/imgbin-hiking-boot-shoe-footwear-boot-AJm4q6nWGeuKV9cn44vXs710J.jpg',
    tags: [
        'beige', 'brown', 'hiking shoes', 'outdoor footwear for rugged terrain and adventurous excursions',
        'durable construction with a heavily reinforced toe cap and a protective heel counter for impact absorption',
        'secure and fully adjustable ghillie-style lace-up closure ensures a snug, customized fit for any foot shape',
        'a sporty yet highly practical design engineered for conquering challenging trails, forest paths, and mountain walks',
        'features a high-traction, multi-directional rubber outsole with deep lugs for unparalleled grip on wet and dry surfaces',
        'built to withstand the elements while providing a cushioned, responsive ride thanks to the shock-absorbing midsole',
        'the ultimate fusion of rugged outdoor functionality and modern athletic design for the dedicated adventurer',
        'padded collar and tongue provide exceptional comfort and crucial ankle support during long, strenuous treks through nature'
    ]
},
    { id: 12, src: 'https://www.freeiconspng.com/uploads/shoes-png-man-11.png', tags: ['brown', 'leather', 'dress shoe', 'formal', 'mens footwear', 'classic cap-toe oxford style for professional and formal occasions', 'elegant and sophisticated design perfect for business suits or evening wear', 'a timeless staple in a gentleman\'s wardrobe featuring detailed stitching'] },
{
    id: 13,
    src: 'https://img.freepik.com/premium-psd/sun-hat-png-isolated-transparent-background_191095-9871.jpg',
    category: 'accessories',
    tags: [
        'tan', 'straw hat', 'summer', 'beachwear', 'wide-brimmed sun protection',
        'a stylish and oversized floppy hat elegantly finished with a classic, contrasting black ribbon band for a touch of sophistication',
        'the quintessential lightweight and breathable accessory for achieving chic sun safety on scorching hot days and extended vacation travel',
        'casual yet glamorous headwear that is beautifully woven from natural straw for an airy, comfortable feel',
        'effortlessly combines everyday practicality with a sense of romantic, bohemian style perfect for the beach or a garden party',
        'features an extra-wide, gracefully floppy brim that casts ample shade over the face, neck, and shoulders to protect from harmful UV rays',
        'an iconic piece of summer fashion that instantly elevates any warm-weather outfit from simple to absolutely stunning'
    ]
},
    { id: 14, src: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Baseball_cap.png', category: 'accessories', tags: ['dark grey', 'hat', 'baseball cap', 'sporty', 'casual headwear with a classic two-tone design', 'a timeless and versatile accessory for everyday wear', 'structured cap with a stiff brim for sun protection', 'unisex'] },
    { id: 15, src: 'https://www.missionmercantile.com/cdn/shop/files/MM-HR.MBLT-SMK.jpg?v=1704942104', category: 'accessories', tags: ['brown', 'leather belt', 'rugged', 'casual', 'durable workwear accessory with a classic metal buckle', 'a timeless and functional piece designed for everyday use with jeans or chinos', 'high-quality handcrafted good that is built to last', 'mens accessories'] }
];