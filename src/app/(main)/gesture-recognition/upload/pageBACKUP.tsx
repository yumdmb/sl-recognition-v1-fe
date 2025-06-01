// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "sonner";
// import { Upload, AlertCircle, Camera, X, Image as ImageIcon } from 'lucide-react';
// import { LanguageSelector } from '@/components/gesture-recognition/LanguageSelector';
// import { UploadTabs } from '@/components/gesture-recognition/UploadTabs';
// import { UploadButton } from '@/components/gesture-recognition/UploadButton';
// import { RecognitionResultDisplay } from '@/components/gesture-recognition/RecognitionResultDisplay';

// interface RecognitionResult {
//   word: string;
//   confidence: number;
//   imageUrl: string;
// }

// const GestureRecognitionUpload: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
//   const [activeTab, setActiveTab] = useState<string>("upload");
//   const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");
  
//   // Refs for camera functionality
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Camera functions
//   const handleClickFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       toast.error("Camera access denied", {
//         description: "Please allow camera access to take photos"
//       });
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };

//   const takePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.drawImage(video, 0, 0);
//         canvas.toBlob((blob) => {
//           if (blob) {
//             const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
//             const url = URL.createObjectURL(blob);
//             handlePhotoCapture(file, url);
//           }
//         }, 'image/jpeg');
//       }
//     }
//   };

//   // Start camera when camera tab is active
//   useEffect(() => {
//     if (activeTab === "camera") {
//       startCamera();
//     } else {
//       stopCamera();
//     }
    
//     return () => {
//       stopCamera();
//     };
//   }, [activeTab]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setRecognitionResult(null);
//     }
//   };
//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     setRecognitionResult(null);
//   };

//   const handlePhotoCapture = (file: File, newPreviewUrl: string) => {
//     setSelectedFile(file);
//     setPreviewUrl(newPreviewUrl);
//     setRecognitionResult(null);
//     setActiveTab("upload");
//     stopCamera(); // Stop camera after capturing
//   };

//   const handleTryAgain = () => {
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     setRecognitionResult(null);
//   };
//   const handleUpload = async () => {
//     if (!selectedFile || !previewUrl) {
//       toast.error("No file selected", {
//         description: "Please select an image to upload"
//       });
//       return;
//     }

//     setIsLoading(true);
//     setRecognitionResult(null);

//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // Mock recognition results
//       const mockResults = {
//         ASL: [
//           { word: "Hello", confidence: 0.95 },
//           { word: "Thank you", confidence: 0.88 },
//           { word: "Please", confidence: 0.92 },
//           { word: "Goodbye", confidence: 0.85 },
//           { word: "Yes", confidence: 0.97 },
//           { word: "No", confidence: 0.94 }
//         ],
//         MSL: [
//           { word: "Selamat", confidence: 0.93 },
//           { word: "Terima kasih", confidence: 0.89 },
//           { word: "Sila", confidence: 0.91 },
//           { word: "Selamat tinggal", confidence: 0.86 },
//           { word: "Ya", confidence: 0.96 },
//           { word: "Tidak", confidence: 0.95 }
//         ]
//       };

//       // Randomly select a result from the mock data
//       const results = mockResults[language];
//       const randomResult = results[Math.floor(Math.random() * results.length)];

//       // Create mock response
//       const mockResponse = {
//         word: randomResult.word,
//         confidence: randomResult.confidence,
//         imageUrl: previewUrl // previewUrl is guaranteed to be string here due to the check above
//       };

//       setRecognitionResult(mockResponse);
//       toast.success("Recognition complete", {
//         description: `The gesture has been recognized successfully in ${language}.`
//       });

//       /* 
//       // TODO: Uncomment this section to use the actual API instead of mock data
//       // API Implementation
//       const formData = new FormData();
//       formData.append('image', selectedFile);
//       formData.append('language', language);

//       const response = await fetch('/api/gesture-recognition/recognize', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Recognition failed');
//       }

//       const data = await response.json();
//       setRecognitionResult(data);
//       toast.success("Recognition complete", {
//         description: `The gesture has been recognized successfully in ${language}.`
//       });
//       */

//     } catch (error) {
//       toast.error("Recognition failed", {
//         description: "Unable to recognize the gesture. Please try again."
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Upload Gesture Image</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Upload className="mr-2 h-5 w-5" /> Gesture Image
//             </CardTitle>
//             <CardDescription>
//               Upload or capture a gesture image to recognize the corresponding word
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-4">
//               <Label htmlFor="language">Sign Language</Label>
//               <Select 
//                 value={language} 
//                 onValueChange={(val: "ASL" | "MSL") => setLanguage(val)}
//               >
//                 <SelectTrigger id="language" className="w-full">
//                   <SelectValue placeholder="Select language" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ASL">American (ASL)</SelectItem>
//                   <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="upload" className="flex items-center">
//                   <Upload className="mr-2 h-4 w-4" /> Upload
//                 </TabsTrigger>
//                 <TabsTrigger value="camera" className="flex items-center">
//                   <Camera className="mr-2 h-4 w-4" /> Camera
//                 </TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="upload" className="space-y-4">
//                 <div 
//                   className={`border-2 border-dashed rounded-lg p-6 text-center ${
//                     previewUrl ? 'border-gray-300' : 'border-primary'
//                   }`}
//                 >
//                   {previewUrl ? (
//                     <div className="flex flex-col items-center">
//                       <img 
//                         src={previewUrl} 
//                         alt="Selected gesture" 
//                         className="max-h-40 max-w-full mb-4 rounded" 
//                       />
//                       <button 
//                         onClick={() => {
//                           setSelectedFile(null);
//                           setPreviewUrl(null);
//                           setRecognitionResult(null);
//                         }}
//                         className="text-sm text-red-500 hover:underline"
//                       >
//                         <X className="h-4 w-4 inline mr-1" /> Remove image
//                       </button>
//                     </div>
//                   ) : (
//                     <div 
//                       className="flex flex-col items-center cursor-pointer" 
//                       onClick={handleClickFileInput}
//                     >
//                       <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
//                       <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
//                       <p className="text-xs text-gray-400">PNG, JPG or GIF (max. 5MB)</p>
//                     </div>
//                   )}
//                   <input 
//                     ref={fileInputRef}
//                     type="file" 
//                     onChange={handleFileChange}
//                     className="hidden"
//                     accept="image/*"
//                   />
//                 </div>
//               </TabsContent>
              
//               <TabsContent value="camera">
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <video 
//                       ref={videoRef} 
//                       autoPlay 
//                       className="w-full rounded-lg border border-gray-200" 
//                     />
//                     <canvas ref={canvasRef} className="hidden" />
//                   </div>
//                   <Button 
//                     onClick={takePhoto} 
//                     className="w-full"
//                   >
//                     <Camera className="mr-2 h-4 w-4" /> Take Photo
//                   </Button>
//                 </div>
//               </TabsContent>
//             </Tabs>
            
//             <Button 
//               onClick={handleUpload} 
//               className="w-full"
//               disabled={!selectedFile || isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : (
//                 <span className="flex items-center">
//                   <Upload className="mr-2 h-4 w-4" />
//                   Recognize Gesture
//                 </span>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <AlertCircle className="mr-2 h-5 w-5" /> Recognition Result
//             </CardTitle>
//             <CardDescription>
//               The recognized word from your gesture image
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="flex flex-col items-center justify-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-r-transparent mb-4"></div>
//                 <p className="text-gray-500">Processing your gesture...</p>
//               </div>
//             ) : recognitionResult ? (
//               <div className="space-y-6">
//                 <div className="text-center">
//                   <p className="text-4xl font-bold text-primary mb-2">
//                     {recognitionResult.word}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     in {language} Sign Language
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Confidence</span>
//                     <span className="text-sm text-gray-500">
//                       {Math.round(recognitionResult.confidence * 100)}%
//                     </span>
//                   </div>
//                   <Progress 
//                     value={recognitionResult.confidence * 100} 
//                     className="h-2"
//                   />
//                 </div>

//                 <div className="border-t pt-4">
//                   <h4 className="font-medium mb-2">Preview</h4>
//                   <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50">
//                     <img
//                       src={recognitionResult.imageUrl}
//                       alt="Recognized gesture"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 <Button 
//                   className="w-full"
//                   onClick={() => {
//                     setSelectedFile(null);
//                     setPreviewUrl(null);
//                     setRecognitionResult(null);
//                   }}
//                 >
//                   Try Another Gesture
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-8 text-center">
//                 <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
//                 <p className="text-gray-500">
//                   Upload or capture a gesture image to see the recognition result
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default GestureRecognitionUpload; 