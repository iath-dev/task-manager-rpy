import { Loader2 } from 'lucide-react'

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="animate-spin" />
    </div>
  )
}

export default Spinner
