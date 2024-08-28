import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../ui/button'
import UploadImage from './UploadImage'
import { Textarea } from '../ui/textarea'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '../ui/use-toast'

type GenerateImageProps = {
  field: (fileName: string) => void,
  imageUrl?: string,
  setImageFilePath:  Dispatch<SetStateAction<File | undefined>>,
  setImageBlob:  Dispatch<SetStateAction<Blob | undefined>>
}

function GenerateImage({ field, imageUrl: prevImageUrl, setImageFilePath, setImageBlob }: GenerateImageProps) {
  const { toast } = useToast()

  const [isImageGenerating, setIsImageGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState(prevImageUrl)
  const [generateImageWithAI, setGenerateImageWithAI] = useState(true)
  const [prompt, setPrompt] = useState("")
  
  const generateImage = async (prompt: string) => {
    if (!prompt) {
       return toast({
        title: "Please provide a prompt.",
        variant: "destructive"
      })
    }

    setIsImageGenerating(true)

    try {
      const url = "https://socialsphere-6dmg.onrender.com/"
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      })
      const dataArrayBuffer = await res.arrayBuffer()
    
      const blob = new Blob([dataArrayBuffer], { type: 'image/jpeg' });
      setImageBlob(blob)
      const imageUrl = URL.createObjectURL(blob)
      setImageUrl(imageUrl)
      field(imageUrl)
      toast({
        title: "Image generated successfully.",
      })
    } catch (error) {
      console.log(error)
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
          Generate image
        </Button>
        <Button
          className={cn("w-full bg-dark-3 hover:bg-dark-3", { "bg-light hover:bg-light": generateImageWithAI === false })} 
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
                />)}

                <Button
                  type="button"
                  onClick={() => generateImage(prompt)}
                  disabled={isImageGenerating}
                  className="bg-blue hover:bg-[#a33af9d0]"
                >
                  {isImageGenerating
                    ? (
                      <>
                        Generating...
                        {isImageGenerating && <Loader className="animate-spin ml-1" />}
                      </>
                    ): (
                      "Generate image"
                    )
                  }
                </Button>
              </div>
          ): (
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

export default GenerateImage
