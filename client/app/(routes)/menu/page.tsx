import getCategories from "@/actions/get-categories";
import Box from "@/components/box";
import Container from "@/components/container";
import FilterContainer from "@/components/filter-container";
import CategoryFilter from "./components/category-filter";
import getSizes from "@/actions/get-sizes";
import getCuisines from "@/actions/get-cuisines";
import SizeFilter from "./components/size-filter";
import CuisinFilter from "./components/cuisine-filter";
import PageContent from "./components/page-content";
import getProducts from "@/actions/get-products";

interface MenuPageProps {
  searchParams: {
    size?: string;
    isFeatured?: boolean;
    cuisine?: string;
    category?: string;
  };
}
const MenuPage = async ({ searchParams }: MenuPageProps) => {
  try {
    const categories = await getCategories();
    const sizes = await getSizes();
    const cuisines = await getCuisines();
    const products = await getProducts({
      size: searchParams.size,
      isFeatured: searchParams.isFeatured,
      cuisine: searchParams.cuisine,
      category: searchParams.category,
    });

    return (
      <Container className="px-4 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 py-12 gap-2">
          <div className="hidden md:block col-span-2">
            <FilterContainer>
              <CategoryFilter categories={categories} />
              <SizeFilter sizes={sizes} />
              <CuisinFilter cuisines={cuisines} />
            </FilterContainer>
          </div>
          <Box className="col-span-12 md:col-span-10 flex flex-col items-start justify-start">
            <PageContent product={products} />
          </Box>
        </div>
      </Container>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }
};


export default MenuPage;
