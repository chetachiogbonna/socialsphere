import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import UploadImage from './UploadImage'
import { Textarea } from '../ui/textarea'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '../ui/use-toast'
import { generateImage } from '@/lib/config/api'
import { aiContext } from '@/context/AIContext'

type GenerateImageProps = {
  field: (fileName: string) => void,
  imageUrl?: string,
  setImageFilePath: Dispatch<SetStateAction<File | undefined>>,
  setImageBlob: Dispatch<SetStateAction<Blob | undefined>>,
  setImageUrl: Dispatch<SetStateAction<string>>
}

function GenerateImage({ field, imageUrl: prevImageUrl, setImageFilePath, setImageBlob, setImageUrl }: GenerateImageProps) {  
  const { toast } = useToast()
  const { isImageGenerating, setIsImageGenerating, setImagePrompt: setPrompt, imagePrompt: prompt } = aiContext()

  const [imageUrl, setLocalImageUrl] = useState(prevImageUrl || "")
  const [generateImageWithAI, setGenerateImageWithAI] = useState(true);

  useEffect(() => {
    if (prevImageUrl) {
      setLocalImageUrl(prevImageUrl);
    }
  }, [prevImageUrl]);

  const getImage = async (prompt: string) => {
    if (!prompt) {
      return toast({
        title: "Please provide a prompt.",
        variant: "destructive"
      })
    }

    setIsImageGenerating(true)
    
    try {
      const blobResponse = await generateImage(prompt)
      setImageBlob(blobResponse)
      const generatedUrl = URL.createObjectURL(blobResponse)
      setLocalImageUrl(generatedUrl)
      setImageUrl(generatedUrl) 
      field(generatedUrl)
      toast({
        title: "Image generated successfully.",
      })
    } catch (error) {
      toast({
        title: JSON.stringify(error),
        variant: "destructive"
      })
    } finally {
      setIsImageGenerating(false)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2">
        <Button 
          className={cn("w-full bg-dark-3 hover:bg-dark-3", { "bg-light hover:bg-light": generateImageWithAI })}
          disabled={isImageGenerating} 
          onClick={() => setGenerateImageWithAI(true)}
          type="button"
        >
          Generate image with AI
        </Button>
        <Button
          className={cn("w-full bg-dark-3 hover:bg-dark-3", { "bg-light hover:bg-light": !generateImageWithAI })} 
          disabled={isImageGenerating} 
          onClick={() => setGenerateImageWithAI(false)}
          type="button"
        >
          Select from computer
        </Button>
      </div>

      <div>
        {generateImageWithAI
          ? ( 
            <div className="flex flex-col gap-2">
              <Textarea 
                className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-2 text-white"
                placeholder="AI prompt to generate image (might take upto 5 mins to generate)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              {imageUrl && (
                <UploadImage 
                  field={field}
                  imageUrl={imageUrl}
                  setImageFilePath={setImageFilePath}
                />
              )}

              <Button
                type="button"
                id="generate-image-button"
                onClick={() => getImage(prompt)}
                disabled={isImageGenerating}
                className="bg-blue hover:bg-[#a33af9d0]"
              >
                {isImageGenerating ? (
                  <>
                    Generating...
                    {isImageGenerating && <Loader className="animate-spin ml-1" />}
                  </>
                ) : (
                  "Generate image"
                )}
              </Button>
            </div>
          )
          : (
            <UploadImage 
              field={field}
              imageUrl={imageUrl}
              setImageFilePath={setImageFilePath}
            />
          )
        }
      </div>
    </>
  )
}

export default GenerateImage;
