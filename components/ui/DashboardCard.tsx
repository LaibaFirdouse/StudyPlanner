type Props = {
    title: string;
    value: string;
};

export default function DashboardCard({ title, value }: Props) {
    return (
        <div>
            <p>{title}</p>
            <h3>{value}</h3>
        </div>
    );
}