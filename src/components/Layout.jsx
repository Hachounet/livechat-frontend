import PropTypes from 'prop-types';

export default function Layout({ children }) {
  return (
    <div className=" h-screen flex overflow-hidden custom-bg-gradient">
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
