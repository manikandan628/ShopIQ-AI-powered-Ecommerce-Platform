const Skeleton = ({ width = '100%', height = '20px', style = {} }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

export const ProductCardSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Skeleton height="300px" />
    <Skeleton height="14px" width="40%" />
    <Skeleton height="20px" width="80%" />
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton height="18px" width="30%" />
      <Skeleton height="18px" width="20%" />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div style={{ display: 'flex', gap: '4rem', padding: '4rem 2rem' }}>
    <Skeleton height="500px" width="50%" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Skeleton height="14px" width="30%" />
      <Skeleton height="40px" width="80%" />
      <Skeleton height="24px" width="25%" />
      <Skeleton height="1px" width="100%" />
      <Skeleton height="80px" width="100%" />
      <Skeleton height="50px" width="100%" />
    </div>
  </div>
);

export default Skeleton;
