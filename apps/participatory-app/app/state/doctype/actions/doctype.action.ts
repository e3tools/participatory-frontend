import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocTypeService } from "data-layer/services/doctype";

export const getDocTypes = createAsyncThunk(
    'doctype/getDocTypes',
    async () => {
        const response = await new DocTypeService('DocType').get_all();
        return response;
    }
)