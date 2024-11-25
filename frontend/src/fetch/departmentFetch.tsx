import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import IDepartment from "../types/IDepartment";
import IDepartmentById from "../types/IDepartmentById";
import IUpdateDepartment from "../types/IUpdateDepartment";
import IError from "../types/IError";
import { SubmitHandler } from "react-hook-form";
import IDepartmentData from "../types/IDepartmentData";

const API_URL = "/api/Department";

export function useDepartments() {
  const fetchData = async (): Promise<IDepartment> => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  const { data, isLoading, error } = useQuery<IDepartment, Error>({
    queryKey: ["departments"],
    queryFn: fetchData,
  });

  return { data, isLoading, error };
}

export function useDepartmentById(id: string) {
	const fetchData = async (): Promise<IDepartmentById> => {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	};

	const { data, isLoading, error } = useQuery<IDepartmentById, Error>({
		queryKey: ["department", id],
		queryFn: fetchData,
	});

	return { data, isLoading, error };
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDepartment: IDepartmentData) => {
			const response = await axios.post(API_URL, newDepartment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
				queryKey: ["departments"],
      });
		},
		onError: (error: AxiosError<IError>) => {
			alert(error.response?.data.message);
		}
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
		mutationFn: async (updatedDepartment: IUpdateDepartment) => {
			console.log(updatedDepartment);
      const response = await axios.put(
        `${API_URL}/${updatedDepartment.id}`,
        updatedDepartment
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}

export function useDeleteDepartment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await axios.delete(`${API_URL}/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["departments"],
			});
		}
	});
}


export function useDepartmentData() {
	const { data, isLoading, error } = useDepartments();
	const { mutate } = useCreateDepartment();
	const updateDepartment = useUpdateDepartment().mutate;
	const deleteDepartment = useDeleteDepartment().mutate;

	const onSubmit: SubmitHandler<IDepartmentData> = async (data) => {
		data.name = data.name.toLowerCase();
		mutate(data);
	}

	const handleUpdate: SubmitHandler<IUpdateDepartment> = async (data) => {
		data.name = data.name.toLowerCase();
		updateDepartment(data);
	}

	const handleDelete: (id: string) => void = (id) => {
		if (!window.confirm("Are you sure you want to delete this department?")) {
			return;
		}
		id = id.toLowerCase();
		deleteDepartment(id);
	}

	return { data, isLoading, error, onSubmit, handleDelete, handleUpdate }
}