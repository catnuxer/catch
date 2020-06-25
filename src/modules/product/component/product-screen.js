import React, { Profiler, useCallback, useState, createRef } from "react";
import Container from "../../../layouts/component/layout-container";
import Card from "./product-card";
import FilterContainer, {
  LogoArea,
  FilterButtonArea,
  FilterButtonWrapper,
} from "./product-filter";
import { Button, ListPopUp } from "../../../layouts/component/layout-button";
import { useOnClickOutside } from "../../../hooks/hooks-clickoutside";

/**
 * Product Filter Area
 */
export function ProductFilterArea({ onSortHighPrice, onSortLowPrice }) {
  const ref = createRef();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const openListPopUp = useCallback(() => {
    setIsPopUpOpen(true);
  });
  const list = [
    {
      label: "Price High To Low",
      onPress: () => {
        onSortHighPrice();
        setIsPopUpOpen(false);
      },
    },
    {
      label: "Price Low To High",
      onPress: () => {
        onSortLowPrice();
        setIsPopUpOpen(false);
      },
    },
  ];
  useOnClickOutside(ref, () => setIsPopUpOpen(false));

  return (
    <Container>
      <FilterContainer>
        <LogoArea />
        <FilterButtonArea>
          <FilterButtonWrapper data-testid="filter-wrapper">
            <Button label={"Filter Product"} onPress={openListPopUp} />
            {isPopUpOpen && <ListPopUp data={list} ref={ref} />}
          </FilterButtonWrapper>
        </FilterButtonArea>
      </FilterContainer>
    </Container>
  );
}

/**
 * ProductCardLoading only render if
 * data not loaded
 */
export function ProductCardLoading() {
  return (
    <Card.Col data-testid="product-card-loading">
      <Card.Link>
        <Card.Sold></Card.Sold>
        <Card.Content>
          <Card.ImageLoading />
          <Card.InfoProduct>
            <Card.ProductTitleLoading />
            <Card.ProductPriceLoading />
            <Card.ProductPriceLoading />
          </Card.InfoProduct>
        </Card.Content>
      </Card.Link>
    </Card.Col>
  );
}

/**
 * Product Card should render data from results response api
 * related with reducers product.
 * Requirement:
 * data.quantityAvailable == 0 then show Card.Sold
 * data.retailPrice !== 0 then Card.ProductRetail show
 * @param {Array} data
 */
export function ProductCard({ data, t }) {
  return (
    <Card.Col data-testid="product-card">
      <Card.Link>
        {data.quantityAvailable == 0 ? (
          <Card.Sold data-testid="product-sold">
            {t("nsProduct:sold")}
          </Card.Sold>
        ) : null}

        <Card.Content>
          <Card.Image data-testid="product-card-image"></Card.Image>
          <Card.InfoProduct>
            <Card.ProductTitle data-testid="product-card-title"></Card.ProductTitle>
            {data.retailPrice !== 0 ? (
              <Card.ProductRetail data-testid="product-card-retail" />
            ) : null}
            <Card.ProductPrice data-testid="product-card-price"></Card.ProductPrice>
          </Card.InfoProduct>
        </Card.Content>
      </Card.Link>
    </Card.Col>
  );
}

/**
 * Render product screen
 * related data with reducers and action filter
 * reducers: product,
 * actions: { sortProductHighPrice, sortProductLowPrice}
 */
export function ProductContainer({
  product,
  sortProductHighPrice,
  sortProductLowPrice,
  t,
}) {
  return (
    <Profiler id="ProductScreen" onRender={() => {}}>
      <ProductFilterArea
        onSortHighPrice={sortProductHighPrice}
        onSortLowPrice={sortProductLowPrice}
      />
      <Container>
        {product && product.loaded
          ? product.data.map((item) => (
              <ProductCard data={item} key={item.id} t={t} />
            ))
          : [0, 1, 2, 3].map((item) => (
              <ProductCardLoading key={item.toString()} />
            ))}
      </Container>
    </Profiler>
  );
}

function ProductScreen(props) {
  return <ProductContainer {...props} />;
}

export default ProductScreen;
