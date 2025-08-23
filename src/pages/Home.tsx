
import Hero from '../Hero'
import DataStructureCategories from '@/data-structure-categories';
import AlgorithmCategories from '../AlgorithmCategories';
function Home() {
  return (
    <div className='dark:bg-black'>
      <Hero />
      <AlgorithmCategories/>

    <DataStructureCategories/>
    </div>
  )
}

export default Home;
