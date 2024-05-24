import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function index({auth, projects, queryParams = null, success}){
    queryParams = queryParams || {}
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('project.index'), queryParams)
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;

        searchFieldChanged(name, e.target.value);
    }

    const sortChanged = (name) => {
        if(name === queryParams.sort_field){
            if (queryParams.sort_direction === 'asc'){
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('project.index'), queryParams)
    }

    const deleteProject = (project) => {
        if (!window.confirm('Are you sure you want to delete this project?')){
            return;
        }
        router.delete(route('project.destroy', project.id))
    }

    return (
        <Authenticated
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Projects</h2>
                    <Link href={route('project.create')} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                        Add New
                    </Link>
                </div>}>

            <Head title="Projects" />


            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {success &&
                (<div className="bg-emerald-500 py-2 px-4 text-white rounded">
                    {success}
                </div>)}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className={"overflow-auto"}>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3">
                                            <TextInput defaultValue={queryParams.name} className={"w-full"} placeholder="Project Name" onBlur={e => searchFieldChanged('name', e.target.value)} 
                                            onKeyPress={e => onKeyPress('name', e)}/>
                                        </th>
                                        <th className="px-3 py-3">
                                            <SelectInput defaultValue={queryParams.status} className={"w-full "} onChange={e => searchFieldChanged('status', e.target.value)}>
                                                <option value="">All Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="comleted">Completed</option>
                                            </SelectInput>
                                        </th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3 text-center"></th>
                                    </tr>
                                </thead>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <TableHeading 
                                        name="id"
                                        sort_field={queryParams.sort_field} 
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}>
                                            ID
                                        </TableHeading>
                                       

                                        <th className="px-3 py-3">Image</th>

                                        <TableHeading 
                                        name="name"
                                        sort_field={queryParams.sort_field} 
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}>
                                            Name
                                        </TableHeading>

                                        <TableHeading 
                                        name="status"
                                        sort_field={queryParams.sort_field} 
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}>
                                            Status
                                        </TableHeading>
                                        
                                        <TableHeading 
                                        name="created_at"
                                        sort_field={queryParams.sort_field} 
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}>
                                            Created Date
                                        </TableHeading>

                                        
                                        <TableHeading 
                                        name="due_date"
                                        sort_field={queryParams.sort_field} 
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}>
                                            Due Date
                                        </TableHeading>


                                        <th className="px-3 py-3">Created By</th>
                                        <th className="px-3 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.data.map(project => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={project.id}>
                                        <td className="px-3 py-2">{project.id}</td>
                                        <td className="px-3 py-2">
                                            <img src={project.image_path} style={{width:80}} alt="image" />
                                        </td>
                                        <td className="px-3 py-2 text-white text-nowrap hover:underline">
                                            <Link href={route("project.show", project.id)}>
                                                {project.name}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status]}>
                                                {PROJECT_STATUS_TEXT_MAP[project.status]}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">{project.created_at}</td>
                                        <td className="px-3 py-2">{project.due_date}</td>
                                        <td className="px-3 py-2">{project.createdBy.name}</td>
                                        <td className="px-3 py-2 text-nowrap">
                                            <Link href={route('project.edit', project.id)} className="font-medium text-blue-500 dark:text-blue-400 hover:underline mx-1">
                                                Edit
                                            </Link>
                                            <button
                                            onClick={e => deleteProject(project)}
                                            className="font-medium text-red-500 dark:text-red-400 hover:underline mx-1">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                                <Pagination links={projects.meta.links}/>
                        </div>
                    </div>
                </div>
            </div>

        </Authenticated>
    )
}