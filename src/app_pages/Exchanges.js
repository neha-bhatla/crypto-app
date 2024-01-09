import {
    useEffect,
    useState,
    useRef,
    useContext,
 } from "react";
 import ReactPaginate from "react-paginate";
 import List_Context from "../app_store/List_Context";
 import Exchange_Info from "../app_components/Exchange_Info";
 
 
 const itemsPerPage = 20;
 
 
 const Exchanges = () => {
    const { exchanges } = useContext(
        List_Context
    );
 
 
    const tableRef = useRef();
 
 
    const [currentRows, setCurrentRows] =
        useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [rowsOffset, setRowsOffset] =
        useState(0);
 
 
    useEffect(() => {
        const last_Offset =
            rowsOffset + itemsPerPage;
        setCurrentRows(
            exchanges.slice(rowsOffset, last_Offset)
        );
        setPageCount(
            exchanges.length / itemsPerPage
        );
    }, [rowsOffset, exchanges]);
 
 
    const page_click = (event) => {
        const updated_Offset =
            (event.selected * itemsPerPage) %
            exchanges.length;
        setRowsOffset(updated_Offset);
        tableRef.current.scrollIntoView();
    };
 
 
    return (
        <main className="main">
            <section ref={tableRef}>
                <div className="title">
                    <h4>Exchanges</h4>
                </div>
                <Exchange_Info
                    rows={currentRows}
                />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={page_click}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageLinkClassName="page-num"
                    pageClassName="page-num"
                    previousClassName="page-num"
                    previousLinkClassName="page-num"
                    nextClassName="page-num"
                    nextLinkClassName="page-num"
                />
            </section>
        </main>
    );
 };
 
 
 export default Exchanges;
 
 
 